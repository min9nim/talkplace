// 라우팅 정의
const express = require('express');
const Post = require('./models/post');
const shortid = require("shortid");
const Comment = require('./models/comment');
const R = require('ramda');

const router = express.Router();
module.exports = router;

const post = {};
const get = {};



function setHasComment(post){
    // hasComment 기능이 추가되기 전 데이터들에 대한 값 보정, 2018/06/16
    post.hasComment = post.hasComment === undefined ? true : post.hasComment;
    return post;
}


// 신규 post 등록
post["/add"] = (req, res) => {
    console.log("received data = " + JSON.stringify(req.body, null, 2));
    var post = new Post();
    Object.assign(post, req.body);
    // 글최초 등록하면 바로 글보기 화면으로 가면서 카운트가 1 증가하는데
    // 최초 등록 후 글이 보여질 때는 view를 0으로 맞추기 위해
    // 아래와 같이 명시적으로 처음에 undefined 값을 할당한다.
    // get["/view/:key"] 함수와 연계하여 생각해 본다
    post.viewCnt = undefined;     

    post.save().then(output => {
        res.send({
            status: 'Success',
            message: `post(${req.body.key}) is saved`,
            output: maskPost(output)
        })
    }).catch(errHandler(res));;   
}



// 글내용 수정
post["/edit/:uuid"] = (req, res) => {
    console.log("received data = " + JSON.stringify(req.body, null, 2));

    Post.findOne({key: req.body.key}).then(post => {
        if(post.uuid !== req.params.uuid){
            res.send({ status : "Fail", message: "Not authorized" });
            return;
        }

        if(post.title !== req.body.title || post.content !== req.body.content){
            // 제목이나 내용이 변경된 경우에만 기존 내용 백업
            var prevPost = new Post();
            prevPost.origin = post.key;
            prevPost.key = shortid.generate(),
            prevPost.title = post.title;
            prevPost.writer = post.writer;
            prevPost.content = post.content;
            prevPost.date = post.date;
            prevPost.isPrivate = post.isPrivate;
            prevPost.hasComment = post.hasComment;
            prevPost.uuid = post.uuid;
            prevPost.viewCnt = post.viewCnt;
            prevPost.context = post.context;                        
            // 근데 여기서 Object.assign 을 사용하면 오류 발생ㅠ
            // https://gist.github.com/min9nim/8f3c3895bf2e41e26921eb1002649306

            prevPost.save().then(output => {
                console.log("# prevPost is saved");
                console.log(output);
            })
        }
        
        // 신규내용으로 업데이트
        Object.assign(post, req.body);
        post.save().then(output => {
            console.log("# afterPost is saved");
            console.log(output);
            res.send({
                status: "Success",
                message: `post@${req.body.key} updated.`,
                output: maskPost(output)
            });
        }).catch(errHandler(res));
    }).catch(errHandler(res));    
}


// 조회수 1증가
get["/view/:key"] = (req, res) => {
    Post.findOne({key: req.params.key}).then(post => {
        if(post.origin) {
            res.send({
                status: "Fail",
                message: `edited Post@${req.params.key} cannot increased viewCnt`,
            });
        }else{
            post.viewCnt = post.viewCnt === undefined ? 1 : post.viewCnt + 1;
            post.save().then(output => {
                console.log(output);
                res.send({
                    status: "Success",
                    message: `post@${req.params.key} viewCnt + 1.`,
                    output: maskPost(output)
                });
            });    
        }
    }).catch(errHandler(res));    
}



// idx 번째부터 cnt 개수만큼 post 를 조회
get["/get/:context/:idx/:cnt"] = (req, res) => {
    const idx = Number(req.params.idx);
    const MAXCNT = 10;  // posts 조회 최대 개수

    if(isNaN(idx)){
        console.log(":idx 가 숫자가 아닙니다");
        res.status(500).send(":idx 가 숫자가 아닙니다");
        return;
    }

    let cnt = Number(req.params.cnt);
    if(isNaN(cnt)){
        console.log(":cnt 가 숫자가 아닙니다");
        res.status(500).send(":cnt 가 숫자가 아닙니다");
        return;
    }

    // 조회 최대 건수 제한
    cnt = cnt > MAXCNT ? MAXCNT : cnt;

    Post.find({$and : [{isPrivate:{$in: [ false, undefined ]}}, {origin: undefined}, {context: req.params.context === "root" ? undefined : req.params.context}]})
        .sort({"date" : -1})    // 최종수정일 기준 내림차순
        .skip(idx)
        .limit(cnt)
        .then(R.map(setHasComment))
        .then(posts => {
            //console.log(JSON.stringify(posts, null,2));
            let res = R.map(maskPost)(posts);
            //console.log(JSON.stringify(res, null,2));
            return res;

        })
        .then(posts => res.send({status: "Success", posts : posts}))
        .catch(errHandler(res));
}


// key 에 해당하는 post 를 delete
get["/delete/:key/:uuid"] = (req, res) => {
    Post.findOne({ key: req.params.key })
        .then(post => {
            console.log(`# valid-delete-url = /delete/${post.key}/${post.uuid}`);
            if(post.uuid === req.params.uuid){

                post.deleted = true;
                post.save().then(output => {
                    console.log(output);
                    res.send({
                        status: "Success",
                        message: `post(${req.params.key}) is deleted`,
                        output: maskPost(output)
                    });                    
                });
            }else{
                res.send({ status : "Fail", message: "Not authorized" });
            }
        })
        .catch(errHandler(res));
};


// delete 된 글을 복원
get["/restore/:key/:uuid"] = (req, res) => {
    Post.findOne({ key: req.params.key })
        .then(post => {
            if(post.uuid === req.params.uuid){
                post.deleted = false;
                post.save().then(output => {
                    console.log(output);
                    res.send({
                        status: "Success",
                        message: `post(${req.params.key}) is restored`,
                        output: maskPost(output)
                    });                    
                });

            }else{
                res.send({ status : "Fail", message: "Not authorized" });
            }
        })
        .catch(errHandler(res));
}



// key 에 해당하는 post 를 remove
get["/remove/:key/:uuid"] = (req, res) => {
    Post.findOne({ key: req.params.key })
        .then(post => {
            console.log(`# valid-remove-url = /remove/${post.key}/${post.uuid}`);
            if(post.uuid === req.params.uuid){
                if(post.commentCnt){
                    res.send({
                        status: "Fail",
                        message: `post(${req.params.key}) has comments`,
                    });
                }else{
                    Comment.remove({postKey: req.params.key})
                        .then(output => {
                            console.log(output);
                            return Post.remove({$or: [{key: req.params.key}, {origin: req.params.key}]});
                        }).then(output => {
                            console.log(output);
                            res.send({
                                status: "Success",
                                message: `post(${req.params.key}) is removed`,
                                output
                            });
                        })
                }
            }else{
                res.send({ status : "Fail", message: "Not authorized" });
            }
        })
        .catch(errHandler(res));
};


// key 에 해당하는 post 를 조회
get["/get/:key"] = (req, res) => {
    Post.findOne({ key: req.params.key })
        .then(maskPost)
        .then(setHasComment)
        .then(post => res.send({status: "Success", post}))
        .catch(errHandler(res));
}


// key에 해당하는 포스트의 작성자가 맞는지 확인
get["/auth/:key/:uuid"] = (req, res) => {
    Post.find({ key: req.params.key })
        .then(posts => {
            console.log(posts);
            if(posts[0].uuid === req.params.uuid){
                res.send({
                    status : "Success",
                    message: "Authorized ok",
                    post: maskPost(posts[0])
                 });
            }else{
                res.send({ status : "Fail", message: "Not authorized" });
            }
        })
        .catch(errHandler(res));
}




// key 에 해당하는 post 를 조회
get["/history/:key"] = (req, res) => {
    Post.find({ origin: req.params.key })
        .then(R.map(maskPost))
        .then(R.map(setHasComment))
        .then(posts => res.send({status: "Success", posts}))
        .catch(errHandler(res));
}




// 라우터의 콜백을 프라미스 패턴으로 바꾸고자 했던 노력의 흔적..
// https: //gist.github.com/min9nim/c5dbdafc3a28f71a0c92dfd06bfdaf9e

function maskPost(post){
    //post.origin = undefined;  // Post 에서 댓글출력여부 판단시 필요함
    post.uuid = undefined;

    // _id 는 아래와 같이 해도 다른 값이 다시 세팅이 됨. _id속성에 setter 가 설정 되어있는듯
    post._id = undefined;       
    post.__v = undefined;
    // for(var i in post){
    //     console.log(i + ", ");
    // }
    return post;
    /* 아래와 같이 처리하면 난리납니다..
    https://github.com/min9nim/talkplace/wiki/%5BMongoDB%5D-%EB%8B%A4%ED%81%90%EB%A8%BC%ED%8A%B8%EC%9D%98-%EC%9D%BC%EB%B6%80-%EB%82%B4%EC%9A%A9%EB%A7%8C-%EC%A7%80%EC%9A%B0%EA%B3%A0%EC%9E%90-%ED%95%A0-%EB%95%8C
    
    return Object.assign({}, post, {
        uuid: undefined,
        _id: undefined,
        __v: undefined,
    });
    */
}

function setHasComment(post){
    // hasComment 기능이 추가되기 전 데이터들에 대한 값 보정, 2018/06/16
    post.hasComment = post.hasComment === undefined ? true : post.hasComment;
    return post;
}


function errHandler(res){
    return err => {
        console.log(err);
        res.status(500).send({status: "Fail", message: err.toString()});
    }
}



router.post("/add", post["/add"]);
router.post("/edit/:uuid", post["/edit/:uuid"]);

router.get("/get/:context/:idx/:cnt", get["/get/:context/:idx/:cnt"]);
router.get("/delete/:key/:uuid", get["/delete/:key/:uuid"]);
router.get("/restore/:key/:uuid", get["/restore/:key/:uuid"]);
router.get("/remove/:key/:uuid", get["/remove/:key/:uuid"]);
router.get("/get/:key", get["/get/:key"]);
router.get("/auth/:key/:uuid", get["/auth/:key/:uuid"]);
router.get("/history/:key", get["/history/:key"]);
router.get("/view/:key", get["/view/:key"]);
