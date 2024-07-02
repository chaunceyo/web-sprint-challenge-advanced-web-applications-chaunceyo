import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {



  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  
  
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/")}
  const redirectToArticles = () => {navigate("/articles") }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    setMessage("Goodbye!")
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!

    //FETCH, NAVIGATE AND ADD TO PROPS
    setMessage('')
    setSpinnerOn(true)
    fetch(loginUrl, {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      }),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ouch, status ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      localStorage.setItem('token', data.token)
      setMessage(data.message)
      redirectToArticles()
      setSpinnerOn(false)
    })
    .catch(error => {
      console.error('Error: ', error)
      redirectToLogin()
      setSpinnerOn(false)
    }) 
  }

  const getArticles = async ()  => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!

    //FETCH AND ADD TO PROPS
    setMessage('')
    setSpinnerOn(true)
      try{
        const {data} = await axios.get(
          articlesUrl,
          {headers : {Authorization : localStorage.getItem('token')}}
        )
          
          console.log(data)
          setArticles(data.articles)
          setMessage(data.message)
          setSpinnerOn(false)
          
      }catch (error) {
        if(error?.response?.status === 401) {redirectToLogin()
        setSpinnerOn(false)
        setMessage(error.response.data.message) 
        }
      }
    
 
    
  }

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.

    //FETCH AND ADD TO PROPS
    setMessage('')
    setSpinnerOn(true)
    fetch(articlesUrl, {
      method: 'POST',
      body: JSON.stringify({
        title: article.title,
        text: article.text,
        topic: article.topic
      }),
      headers: new Headers({
        'Content-Type' : 'application/json',
        Authorization : localStorage.getItem('token')
      })
    })
    .then(res => {
      if(!res.ok){
        throw new Error("Can't POST article", res.status)
      }
      return res.json()
    })
    .then(data => {
      console.log("POST articles data: ", data)
      setMessage(data.message)
      setSpinnerOn(false)
      
      
    })
    .catch(error => {
      if(error?.response?.status === 401) redirectToLogin()
      setSpinnerOn(false)
    })
    
    setArticles([...articles, article])
  
  }

  const updateArticle = ( article_id, article ) => {
    // ✨ implement
    // You got this!

    //FETCH AND ADD TO PROPS
    setMessage('')
    setSpinnerOn(true)
    

    fetch(`${articlesUrl}/${article_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: article.title,
        text: article.text,
        topic: article.topic
      }),
      headers: new Headers({
        'Content-Type' : 'application/json',
        Authorization : localStorage.getItem('token')
      })
    })
    .then(res => {
      if(!res.ok){
        throw new Error("Can't POST article", res.status)
      }
      return res.json()
    })
    .then(data => {
      console.log("PUT articles data: ", data)
      setMessage(data.message)
      setSpinnerOn(false)
      
    })
    .catch(error => {
      if(error?.response?.status === 401) redirectToLogin()
      setSpinnerOn(false)
    })
    setArticles(articles.map(art=> {
      if(art.article_id === article_id){
        return article
      }else{
        return art
      }
    }))

  }

  const deleteArticle = (article_id) => {
    // ✨ implement

    //FETCH AND ADD TO PROPS
    setMessage('')
    setSpinnerOn(true)
    try{
    fetch(`${articlesUrl}/${article_id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type' : 'application/json',
        Authorization : localStorage.getItem('token')
      })
    })
    .then(res => {
      if(!res.ok){
        throw new Error("Can't DELETE article", res.status)
      }
      return res.json()

      
    })
    .then(data => {
      console.log("DELETE articles data: ", data)
      setSpinnerOn(false)
      setMessage(data.message)
      setArticles(articles.filter(article => article.article_id !== article_id ))
    })
    }catch(error) {
      if(error?.response?.status === 401) {redirectToLogin()
      setSpinnerOn(false)
   
      }
    }
    


  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner 
        on={spinnerOn}
        />
      <Message 
        message={message}
        />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm
                currentArticle={currentArticleId && articles.find(a => a.article_id === currentArticleId)}
                getArticles={getArticles}
                postArticle={postArticle}
                updateArticle={updateArticle}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                />
              <Articles 
                articles={articles}
                setArticles={setArticles}
                getArticles={getArticles}
                postArticle={postArticle}
                updateArticle={updateArticle}
                deleteArticle={deleteArticle}
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                redirectToLogin={redirectToLogin}
                />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
