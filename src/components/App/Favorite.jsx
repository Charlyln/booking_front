import 'date-fns'
import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { apiUrl } from '../../apiUrl'
import List from '@material-ui/core/List'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Alert from '@material-ui/lab/Alert'

import {
  Button,
  Avatar,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Paper,
  FormControlLabel,
  Checkbox,
  Fade,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import CheckIcon from '@material-ui/icons/Check'
import MyAppBar from '../signUp/appBar/MyAppBar'
import { Redirect } from 'react-router-dom'

function Favorites() {
  const [travels, setTravels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [UserId, setUserId] = useState('')
  const [userdata, setuserdata] = useState([])

  const [endDate, setEndDate] = useState(new Date())
  const [travelId, setTravelId] = useState('')
  const [startDate, setStartDate] = useState(new Date())

  useEffect(() => {
    getTravels()
    getUser()
  }, [])

  const getUser = async () => {
    const id = window.localStorage.getItem('uuid')
    try {
      const res = await Axios.get(`${apiUrl}/users/${id}`)
      setuserdata(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const putLike = async (e) => {
    const id = e.target.id
    const likeObject = userdata.Likes.find((like) => like.TravelUuid === id)
    if (likeObject) {
      const likeId = likeObject.id
      console.log(likeObject)

      await Axios.delete(`${apiUrl}/likes/${likeId}`)
    } else {
      await Axios.post(`${apiUrl}/likes`, {
        TravelUuid: id,
        UserUuid: UserId
      })
    }
    getTravels()
    getUser()
  }

  const getTravels = async () => {
    try {
      const res = await Axios.get(`${apiUrl}/travels`)
      setTravels(res.data)
      setUserId(window.localStorage.getItem('uuid'))
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const sendBooking = async (e) => {
    e.preventDefault()

    try {
      if (startDate && endDate) {
        const UserUuid = window.localStorage.getItem('uuid')

        await Axios.post(`${apiUrl}/bookings`, {
          TravelUuid: travelId,
          UserUuid,
          startDate,
          endDate,
          accepted: 'waiting'
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const ExampleCustomInput = ({ value, onClick }) => (
    <Button
      type="submit"
      color="primary"
      variant="outlined"
      className="example-custom-input"
      onClick={onClick}
    >
      {value}
    </Button>
  )

  if (!window.localStorage.getItem('uuid')) {
    return <Redirect to="/" />
  }

  return (
    <>
      <MyAppBar />

      <Grid container alignItems="center" className="homeContainer">
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container alignItems="center" justify="center">
               
              {isLoading ? (
                ''
              ) : (
                <Fade in={true}>
                  <List className="list">
                    {travels.find((message) =>
                      message.Likes.find(
                        (element) => element.UserUuid === UserId
                      )
                    ) ? (
                      ''
                    ) : (
                      <Alert severity="info" style={{ marginTop: '30px' }}>
                        You haven't liked any trip.
                      </Alert>
                    )}
                    {travels
                      .filter((message) =>
                        message.Likes.find(
                          (element) => element.UserUuid === UserId
                        )
                      )
                      .sort(function (a, b) {
                        return new Date(b.createdAt) - new Date(a.createdAt)
                      })

                      .map((travel) => (
                        <Paper elevation={5}>
                          <Card
                            style={{
                              maxWidth: '500px',
                              margin: '20px 0px'
                            }}
                          >
                            <CardMedia
                              style={{ height: 0, paddingTop: '56.25%' }}
                              image={travel.imageUrl}
                              title={travel.pseudo}
                            />

                            <CardContent>
                              <Typography variant="h5">
                                {travel.title}
                              </Typography>
                            </CardContent>
                            <CardContent>
                              <Typography>{travel.localisation}</Typography>
                            </CardContent>
                            <CardContent>
                              <Typography>{travel.description}</Typography>
                            </CardContent>

                            <CardContent>
                              <List>
                                <ListItem>
                                  <CardContent style={{ padding: '2px' }}>
                                    <DatePicker
                                      selected={startDate}
                                      onChange={(date) => setStartDate(date)}
                                      placeholderText="Select a date other than today or yesterday"
                                      popperPlacement="auto-left"
                                      customInput={<ExampleCustomInput />}
                                    />
                                  </CardContent>
                                  <CardContent style={{ padding: '2px' }}>
                                    <DatePicker
                                      selected={endDate}
                                      onChange={(date) => setEndDate(date)}
                                      excludeDates={[new Date()]}
                                      placeholderText="Select a date other than today or yesterday"
                                      customInput={<ExampleCustomInput />}
                                    />
                                  </CardContent>
                                  <CardContent style={{ padding: '2px' }}>
                                    <form onSubmit={sendBooking}>
                                      {travelId === travel.uuid ? (
                                        <Button
                                          type="submit"
                                          style={{
                                            backgroundColor: '#4caf50'
                                          }}
                                          variant="contained"
                                          endIcon={<CheckIcon />}
                                        >
                                          Sent
                                        </Button>
                                      ) : (
                                        <Button
                                          type="submit"
                                          color="primary"
                                          variant="contained"
                                          onClick={() =>
                                            setTravelId(travel.uuid)
                                          }
                                        >
                                          {travel.Bookings.find(
                                            (booking) =>
                                              booking.UserUuid === UserId
                                          )
                                            ? 'Re book'
                                            : 'Book'}
                                        </Button>
                                      )}
                                    </form>
                                  </CardContent>
                                </ListItem>
                              </List>
                            </CardContent>

                            <CardActions
                              disableSpacing
                              style={{ marginLeft: '5px' }}
                            >
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar
                                    src={travel.User.avatar}
                                    aria-label="recipe"
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={`Post by ${travel.User.pseudo}`}
                                />
                              </ListItem>
                              <FormControlLabel
                                style={{ marginLeft: 'auto' }}
                                control={
                                  <Checkbox
                                    icon={<FavoriteBorder />}
                                    checkedIcon={<Favorite />}
                                    id={travel.uuid}
                                    onChange={putLike}
                                    checked={
                                      travel.Likes.find(
                                        (like) => like.UserUuid === UserId
                                      )
                                        ? true
                                        : false
                                    }
                                  />
                                }
                              />
                            </CardActions>
                          </Card>
                        </Paper>
                      ))}
                  </List>
                </Fade>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Favorites
