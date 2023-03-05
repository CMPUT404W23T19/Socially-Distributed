
import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../components/CommonNav'
import { useRouter } from 'next/router'
import PostsList from './posts';
import TopNavigation from './TopNavigation';
import Feed from './Feed';

export default function Home() {
  return (
    <div>
      <TopNavigation />
      <div className="flex">
        <Nav />
        <Feed />
      </div>
    </div>
  );
}