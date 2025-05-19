import moment from "moment-timezone"



export const timeFormaterFunc = () : string =>  {
     return moment.tz(Date.now(), "Europe/London").format("MMM Do, h:mm A")
}