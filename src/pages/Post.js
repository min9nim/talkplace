import React from 'react'
import { tp } from '../tp'
import { highlight_nl2br, highlight } from '../biz'
import {
  PostMenu,
  CommentWrite,
  CommentList,
  PostMeta,
  MyChannels,
} from '../components'
const R = require('ramda')
import moment from 'moment'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Remarkable from 'remarkable'
//import hljs from 'highlight.js';
import shortcut from '../ext/shortcut'
import $m from '../../com/util.js'

import './Post.scss'
import '../css/hljsTheme/xcode.css'

export default class Post extends React.Component {
  constructor(props) {
    //console.log("Post 생성자 호출");
    super(props)
    this.editPost = this.editPost.bind(this)

    this.state = {
      key: '',
      title: '',
      writer: '',
      content: '',
      date: '',
      isPrivate: false,
      deleted: false,
      uuid: '',
      viewCnt: '',
      origin: '',
      likeCnt: 0,
    }

    if (
      tp.store.getState().data.posts.filter(p => p.origin === undefined)
        .length > 0
    ) {
      this.state = tp.store
        .getState()
        .data.posts.find(post => post.key === this.props.postKey)
    }

    shortcut.add('Alt+E', () => {
      if (location.pathname.indexOf('post') >= 0) {
        // 글보기 화면인 경우에만
        this.props.history.push(location.pathname.replace('post', 'edit'))
      }
    })

    this.contextPath = this.props.context ? '/' + this.props.context : ''
    tp.view.Post = this

    this.unsubscribe = tp.store.subscribe(() => {
      this.setState(
        tp.store
          .getState()
          .data.posts.find(post => post.key === this.props.postKey),
      )
    })

    this.md = new Remarkable({
      html: true,
      linkify: true,
      xhtmlOut: true,
      breaks: true,
      highlight,
    })

    //if(this.props.post){
    this.urlAccess =
      tp.store.getState().data.posts.filter(p => p.origin === undefined)
        .length === 0

    if (!this.urlAccess) {
      // 목록/수정 화면에서 넘어 들어온 경우
      const diff = Date.now() - this.state.date // 여기서 state 가 undefined 인 경우가 있다???
      if (diff < 1000) {
        // 1. 글등록이나 수정하고 바로 들어온 경우
        // 조회수 증가 처리 필요없고, 스토어 업데이트도 필요없음
      } else {
        // 2. List 에서 글 선택해서 들어온 경우
        if (tp.store.getState().data.posts.length > 1) {
          tp.api.viewPost(this.props.postKey).then(res => {
            if (res.status == 'Success') {
              // 일반post 인 경우
              tp.store.dispatch(tp.action.viewPost(this.props.postKey))
              // 여기서 스토어를 업데이트하면 다시 App 부터 리렌더링되면서 로직이 꼬이게 됨, 18.07.25
              // 위에 주석처리하면 목록에서 글보기화면 넘어올 때 viewCnt 가 올라가지 않아서 다시 주석해제 함, 18.08.17

              $m._go(
                Object.assign(res.output, { context: tp.context }),
                tp.action.updatePost,
                tp.store.dispatch,
              )
              //tp.store.dispatch(tp.action.updatePost(Object.assign(res.output, {context: tp.context}))
            } else {
              // 수정내역post 인 경우
            }
          })
        } else {
          // 3.직접URL로 들어온 후 tp.api.viewPost 호출하고 store업데이트 된 후 화면 다시 그리면서 이쪽으로 들어옴
        }
      }
    } else {
      // 3. 직접URL로 치고 들어온 경우
      // - viewPost 호출한 후에 getPost로 응답결과를 그냥 화면에 보여주면 됨
      // - store 업데이트 필요없음
      tp.api.viewPost(this.props.postKey).then(res => {
        if (res.status == 'Success') {
          //console.log("@@ 처음 데이터 가지고 왔음요");
          // 일반post 인 경우

          /**
           * 18.11.09
           *
           * URL로 직접 들어온 경우에 context 정보는 URL 주소값에서 가지고 오도록 한다
           * URL로 직접 access하는 경우에는 context 정보가 민감한 정보알 수 있기 때문에 서버에서 의도적으로 내려주지 않는다
           */
          //Object.assign(res.output, { context: this.props.context })
          Object.assign(res.output, { context: tp.context })

          tp.store.dispatch(tp.action.addPost(res.output))
        } else {
          // 수정내역post 인 경우
          tp.api
            .getPost(this.props.postKey)
            //.then(R.pipe(tp.checkStatus, R.prop("post"), tp.action.addPost, tp.store.dispatch))
            .then(tp.checkStatus)
            .then(R.prop('post'))
            .then(tp.action.addPost)
            .then(tp.store.dispatch)
            .catch(e => {
              //console.log(e.message)
            })
        }
      })
    }
  }

  componentWillUnmount() {
    //console.log("# Post unsubscribe store..");
    this.unsubscribe && this.unsubscribe()
  }

  componentDidMount() {
    document.title = this.state.title
  }

  editPost() {
    tp.api
      .authPost({
        key: this.props.postKey,
        uuid: tp.user.uuid,
      })
      .then(res => {
        if (res.status === 'Success') {
          this.props.history.push(
            this.contextPath + '/edit/' + this.props.postKey,
          )
        } else {
          tp.alert({
            message: res.message,
            style: 'warning',
            width: '160px',
          })
          //this.cancelMenu();
        }
      })
  }

  render() {
    //console.log("Post 렌더링");

    if (this.state.key) {
      // 해당 글로 직접 access 한 경우에도 타이틀 세팅해주려면 여기서 한번 더 타이틀 설정이 필요함
      document.title = this.state.title
    } else {
      return <div />
    }

    let title
    const search = tp.store.getState().view.search
    title = tp.highlight(this.state.title, search)
    //title += this.state.isPrivate ? "<sup> - Private -</sup>" : "";
    title = (this.state.isPrivate ? `<i class="icon-lock"></i>` : '') + title

    const deletedClass = this.state.deleted ? 'deleted' : ''
    const privateClass = this.state.isPrivate ? 'private' : ''
    const titleClass = `title h4 ${deletedClass} ${privateClass}`

    const contentClass = this.state.isMarkdown ? 'markdown' : 'content'
    const contentStyle = `${deletedClass} ${privateClass} ${contentClass}`

    const content = this.state.isMarkdown
      ? this.md.render(highlight_nl2br(this.state.content, search))
      : tp.$m.txtToHtml(this.state.content, search)

    return (
      <div>
        {/* <div className="context">{this.props.context || "Anony"}</div> */}
        <div className="post">
          <div className="title-wrapper">
            <div className="prev-padding"> </div>
            {/*제목에서 검색결과 하이라이트 표시를 하려면 html태그 사용이 필요하다 */}
            <div
              className={titleClass}
              dangerouslySetInnerHTML={{ __html: title }}
            ></div>
          </div>
          <div className="meta">
            <div className="writer-time">
              {this.state.writer} -{' '}
              {moment(this.state.date).format('MM/DD/YYYY dd HH:mm')}
            </div>
            {/**
             * 18.11.09
             * URL에서 channel 값을 지우고 직접 access해서 들어오는 경우에는 this.state.context 값이 false 가 된다
             */
            this.state.context && (
              <PostMenu
                history={this.props.history}
                postKey={this.state.key}
                postDeleted={this.state.deleted}
                postOrigin={this.state.origin}
                post={this.state}
                context={this.props.context}
              />
            )}
          </div>
          <div
            className={contentStyle}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          <PostMeta post={this.state} />
          {//!!this.state.origin || this.state.isPrivate || (
          this.state.context &&
            (!!this.state.origin || (
              //(
              <div>
                <Link to={this.contextPath + '/list'}>
                  <Button bsStyle="success" className="listBtn">
                    <i className="icon-list" />
                    List
                  </Button>
                </Link>
                <Link to={this.contextPath + '/write'}>
                  <Button bsStyle="success" className="writeBtn">
                    <i className="icon-doc-new" />
                    Write
                  </Button>
                </Link>
                <Button
                  bsStyle="success"
                  className="writeBtn"
                  onClick={this.editPost}
                >
                  <i className="icon-pencil" />
                  Edit
                </Button>
              </div>
            ))}
          {this.state.origin && (
            <Link to={this.contextPath + '/postHistory/' + this.state.origin}>
              <Button bsStyle="success" className="writeBtn">
                <i className="icon-history" />
                History
              </Button>
            </Link>
          )}
        </div>

        {!this.state.origin && this.state.hasComment && (
          <div>
            <CommentList
              postKey={this.state.key}
              commentCnt={this.state.commentCnt}
            />
            {this.state.deleted || <CommentWrite postKey={this.state.key} />}
          </div>
        )}

        <div className="channels-wrappter">
          <MyChannels />
        </div>
      </div>
    )
  }
}
