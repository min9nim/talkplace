import React from "react";
import {tp} from "../tp";
import {CommentEdit} from "../components";
import "./CommentMenu.scss";

export default class CommentMenu extends React.Component {
    constructor(props) {
        console.log("CommentMenu 생성자 호출");
        super(props);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.hideEdit = this.hideEdit.bind(this);
        this.editComment = this.editComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.removeComment = this.removeComment.bind(this);
        this.restoreComment = this.restoreComment.bind(this);

        this.state = {
            clicked : false,
            editClicekd : false,
        }
    }

    shouldComponentUpdate(prevProps, prevState) {
        //console.log("CommentMenu.shouldComponentUpdate returns [" + true + "]");
        return true;
    }

    deleteComment(){
        tp.confirm({
            message: "Delete this?",
            width: "inherit",
            onYes : () => {
                tp.api.deleteComment({
                    key: this.props.comment.key,
                    uuid: tp.user.uuid
                }).then(res => {
                    if (res.status === "Fail") {
                        tp.alert({
                            message: res.message,
                            style: "danger",
                            width: "175px"
                        });
                    }else {
                        tp.store.dispatch(tp.action.deleteComment(this.props.comment.key));
                    }
                    this.hideMenu();
                })
            },
            onNo : () => {
                this.hideMenu();
            }
        });
    }
    
    removeComment(){
        tp.confirm({
            message: "Remove this?",
            onYes: () => {
                tp.api.removeComment({
                    key: this.props.comment.key,
                    uuid: tp.user.uuid
                }).then(res => {
                    if (res.status === "Fail") {
                        tp.alert({
                            message: res.message,
                            style: "danger",
                        });            
                    } else {
                        tp.store.dispatch(tp.action.removeComment(this.props.comment.key));

                        // 부모 글의 commentCnt 1감소
                        const postKey = this.props.comment.postKey;
                        let post = tp.store.getState().data.posts.find(p => p.key === postKey);
                        post.commentCnt = post.commentCnt ? post.commentCnt -1 : 1 ;
                        tp.store.dispatch(tp.action.updatePost(post));
                    }
                })
            },
            onNo: () => {
                this.hideMenu();
            }
        });
    }    


    restoreComment(){
        //if(!confirm("Restore this?")) return;
        tp.confirm({
            message: "Restore this?",
            onYes : () => {
                tp.api.restoreComment({
                    key: this.props.comment.key,
                    uuid: tp.user.uuid
                }).then(res => {
                    if (res.status === "Fail") {
                        tp.alert({message: res.message, style: "danger"});
                    } else {
                        tp.store.dispatch(tp.action.restoreComment(this.props.comment.key));
                    }
                    this.hideMenu();
                })
            }
        });
    }  

    editComment(){
        tp.api.authComment({
            key: this.props.comment.key,
            uuid: tp.user.uuid
        }).then(res => {
            if(res.status === "Success"){
                this.showEdit();
                //tp.temp = res.comment;
                //this.props.history.push("/edit/"+this.props.comment.key);
            }else{
                tp.alert({
                    message: res.message,
                    style: "danger",
                });

            }
        })
    }    

    hideMenu(){
        this.setState({clicked: false})
    }

    showMenu(){
        this.setState({clicked: true})
    }

    hideEdit(){
        this.setState({editClicked: false, writer: "", content: ""});
    }

    showEdit(){
        this.setState({editClicked: true});
    }


    render(){
        console.log("CommentMenu 렌더링");
        return (<div className="commentMenu">
                    {this.state.clicked ? 
                        <div className="navi">
                            {
                                this.props.comment.deleted
                                ?
                                    <div className="icon-ccw" onClick={this.restoreComment}>Restore</div>
                                :
                                    <React.Fragment>
                                        <div className="icon-pencil" onClick={this.editComment}>Edit</div>
                                        <div className="icon-trash-empty" onClick={this.deleteComment}>Delete</div>
                                    </React.Fragment>
                            }
                            <div className="icon-trash" onClick={this.removeComment}>Remove</div>
                            <div className="icon-cancel" onClick={this.hideMenu}>Cancel</div>
                        </div>
                    :
                        <div className="navi" onClick={this.showMenu}>...</div>
                    }
                    
                    {this.state.editClicked &&        
                        <CommentEdit hideEdit={this.hideEdit} hideMenu={this.hideMenu} comment={this.props.comment} />        
                    }
                </div>
        );
    }
}
