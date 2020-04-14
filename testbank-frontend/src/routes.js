import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignUpPage from './components/pages/SignUpPage'
import LoginPage from './components/pages/LoginPage';
import BookList from './components/pages/BookList';
import AddBook from './components/pages/AddBook';
import ChapterList from './components/pages/ChapterList';
import AddChapter from './components/pages/AddChapter';
import QuestionList from './components/pages/QuestionList';
import UpsertQuestion from './components/pages/UpsertQuestion';
import QuizList from './components/pages/QuizList';
import QuestionDetail from './components/pages/QuestionDetail';
import UploadPage from './components/pages/UploadPage';

function routes() {
    return (
        <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/signup" component={SignUpPage} />
            <Route path="/books" render={({ match: {url} }) => (
                <div>
                    <Route path={`${url}`} component={BookList} exact />
                    <Route path={`${url}/add`} component={AddBook} exact/>
                    <Route path={`${url}/:bookId`} render={({match: {url, params} }) => (
                        <div>
                            <Route path={`${url}`} component={() => <ChapterList params={params} /> } exact />
                            <Route path={`${url}/chapters`} render={({match, bookId=params.bookId}) => (
                                <div>
                                    <Route path={`${match.url}/add`} component={() => <AddChapter params={{bookId: bookId}} /> } exact/>
                                    <Route path={`${match.url}/:chapterId(${"\\d+"})`} render={({match: {url, params} }) => (
                                        <div>
                                            <Route path={`${url}`} component={() => <QuestionList params={{chapterId: params.chapterId, bookId: bookId}} /> } exact/>
                                            <Route path={`${url}/upload`} component={() => <UploadPage params={{chapterId: params.chapterId, bookId: bookId}} /> } exact/>
                                            <Route path={`${url}/quiz`} component={() => <QuizList params={{chapterId: params.chapterId, bookId: bookId}} /> } exact/>
                                            <Route path={`${url}/questions`} render={({match, chapterId=params.chapterId }) => (
                                                <div>
                                                    <Route path={`${match.url}/add`} component={() => <UpsertQuestion params={{chapterId: chapterId, bookId: bookId}} /> } exact/>
                                                    <Route path={`${match.url}/:questionId(${"\\d+"})`} render={({match: {url, params} }) => (
                                                        <div>
                                                            <Route path={`${url}`} component={() => <QuestionDetail params={{questionId:params.questionId, chapterId: chapterId, bookId: bookId}} /> } exact/>
                                                            <Route path={`${url}/modify`} component={(props) => <UpsertQuestion {...props} params={{questionId:params.questionId, chapterId: chapterId, bookId: bookId}} /> } exact/>
                                                        </div>
                                                    )}/>
                                                </div>
                                            )} />
                                        </div>
                                    )}/>
                                </div>
                            )} />
                        </div>
                    )}/>
                </div>
            ) } />
            {/* <Route component={SignUpPage} /> */}
        </Switch>
    );
}

export default routes;