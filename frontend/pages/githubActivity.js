import { useEffect, useState } from "react"
import { reqUserProfile } from "../api/Api"
import { getCookieUserId } from "../components/utils/cookieStorage"
import React from 'react'
import Link from "next/link"
import { MoodBadTwoTone } from "@material-ui/icons"
import TopNavigation from "./TopNavigation"

export default function githubActivity() {
  const [userId, setUserId] = useState('')
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([]);
  const [isGithubSetted, setisGithubSetted] = useState(false)
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    reqUserProfile(getCookieUserId())
      .then(res => {setUser(res.data);setUserId(res.data.id)}, err => console.log('githubActivity', err))
    if (user) {
      if (user.github) {
        setisGithubSetted(true)
        const username = user.github.split('/').pop()
        fetch(`https://api.github.com/users/${username}/events`)
          .then(res => res.json())
          .then(data => {
            setEvents(data);
            setLoading(false);
            console.log(data);
          })
          .catch(error => {
            console.error(error);
            setLoading(false);
          });
      } else {
        setisGithubSetted(false)
      }
    }
  }, [userId])
  return (
    <div>
      <TopNavigation />
      {isLoading ? (<h1 className="text-3xl font-bold text-center mt-32">Loading...</h1>) : (isGithubSetted ? (
        <div className="mt-28">
          <h1 className="text-center font-bold text-3xl mb-16">Recent Github events for <span className="text-blue-600">{user.github.split('/').pop()}</span></h1>
          <ul>
            {events.map(event => (
              <div key={event.id} className="w-3/5 mx-auto py-2 px-4 my-8 bg-gray-100 shadow-md relative">
                <p className="absolute right-4 top-3">{event.public? "PUBLIC":"PRIVATE"}</p>
                <div className="font-semibold text-2xl text-gray-600 mb-3"><span className="font-semibold">{event.type}</span>
                {event.type === "PushEvent" && <p className="inline">, with <span className="text-red-700">{event.payload.size}</span> commits</p>}</div>
                <p className="text-sm font-semibold">Repo: {event.repo.name}</p>
                {/* <p className="text-xs">at: <a href={event.repo.url}>{event.repo.url}</a></p> */}
                {event.type ==="PushEvent" && <p className="text-xs w-full">Description: {event.payload.commits.map(
                  commit => (<span key={commit.sha}> # {commit.message}</span>)
                )}</p>}
                <div className="flex text-xs text-gray-600 flex-row justify-between mt-1">
                  <p>Author: { event.actor.display_login }</p>
                  <p>{event.created_at}</p>
                </div>
              </div>
            ))}
          </ul>
        </div>
      ) :
        (
          <div className="w-1/3 mx-auto h-1/3 mt-32">
            <MoodBadTwoTone fontSize="large" className="inline-block mb-8 bg-white text-white" />
            <div className="text-large text-gray-600">
              <p className="text-2xl font-bold pb-4 text-black">Cannot Get your Github Activity</p>
              <p className="pb-4">Check your Github account on profile page.</p>
              <Link href="/editprofile">
                <a className="text-blue-600">Click here to edit your profile.</a>
              </Link>
            </div>
          </div>
        ))}
    </div>
  )
}
