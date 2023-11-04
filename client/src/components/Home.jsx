/* eslint-disable react/prop-types */
import { Card, Button, Row, Col, Container, Modal } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';

import MessageContext from '../messageCtx.jsx';
import API from '../API.js';
import { LoadingLayout } from './PageLayout.jsx';

function Home(props) {
  const { handleErrors } = useContext(MessageContext);
  const [services, setServices] = useState([]); // List of services with their information
  const [loading, setLoading] = useState(true);


}


export default Home;
