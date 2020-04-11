import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SignUpPage from './components/pages/SignUpPage'
import LoginPage from './components/pages/LoginPage';
import BookList from './components/pages/BookList';
import AddBook from './components/pages/AddBook';
import ChapterList from './components/pages/ChapterList';
import AddChapter from './components/pages/AddChapter';
import QuestionList from './components/pages/QuestionList';
import AddQuestion from './components/pages/AddQuestion';

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
                            <Route path={`${url}/chapters`} render={({match: {url} }) => (
                                <div>
                                    <Route path={`${url}/add`} component={() => <AddChapter params={params} /> } exact/>
                                    <Route path={`${url}/:chapterId`} render={({ match }) => (
                                        <div>
                                            <Route path={`${match.url}`} component={() => <QuestionList params={{chapterId: match.params.chapterId, bookId: params.bookId}} /> } exact/>
                                            <Route path={`${match.url}/questions/add`} component={() => <AddQuestion params={{url: match.url}} /> } exact/>
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