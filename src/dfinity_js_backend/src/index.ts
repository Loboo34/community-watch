import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  None,
  Some,
  Ok,
  Err,
  ic,
  Principal,
  Opt,
  nat64,
  Duration,
  Result,
  bool,
  Canister,
} from "azle";
import {
  Ledger,
  binaryAddressFromAddress,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";

import { v4 as uuidv4 } from "uuid";

const User = Record({
  id: text,
  name: text,
  email: text,
  address: text,
  watchlist: text,
});

const UserPayload = Record({
    name: text,
    email: text,
    address: text,
    watchlist: text,
    });

const Volunteer = Record({
  userId: text,
  name: text,
  email: text,
  address: text,
  isVerified: bool,
});

const VolunteerPayload = Record({
    userId: text,
    name: text,
    email: text,
    address: text,
    isVerified: bool,
    });

const Incident = Record({
  id: text,
  title: text,
  description: text,
  location: text,
  date: text,
  user: User,
  volunteers: Vec(Volunteer),
});

const watchlist = Record({
    IncidentId: text,
    title: text,
    description: text,
    location: text,
    date: text,
    user: User,
    volunteers: Vec(Volunteer),
    });

const IncidentPayload = Record({
    title: text,
    description: text,
    location: text,
    date: text,
    user: User,
    volunteers: Vec(Volunteer),
    });


const Message = Variant({
  NotFound: text,
  InvalidPayload: text,
});

const usersStorage = StableBTreeMap(0, text, User);
const incidentsStorage = StableBTreeMap(1, text, Incident);
const volunteerStorage = StableBTreeMap(2, text, Volunteer);

export default Canister({
  getUsers: query([], Vec(User), () => {
    return usersStorage.values();
  }),

  //add user
    addUser: update([UserPayload], Result(User, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payoad" });
        }
        const userId = uuidv4();
        const user = {
        id: userId,
        ...payload,
        };
        usersStorage.insert(userId, user);
        return Ok(user);
    }),

    //get user
    getUser: query([text], Opt(User), (userId) => {
        return usersStorage.get(userId);
    }),

    //add incident
    addIncident: update([IncidentPayload], Result(Incident, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payoad" });
        }
        const incidentId = uuidv4();
        const incident = {
        id: incidentId,
        ...payload,
        };
        incidentsStorage.insert(incidentId, incident);
        return Ok(incident);
    }),

    //get incident
    getIncident: query([text], Opt(Incident), (incidentId) => {
        return incidentsStorage.get(incidentId);
    }),

    //get all incidents
    getIncidents: query([], Vec(Incident), () => {
        return incidentsStorage.values();
    }),

    //add volunteer
    addVolunteer: update([VolunteerPayload], Result(Volunteer, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payoad" });
        }
        const userId= uuidv4();
        const volunteer = {
        id: userId,
        ...payload,
        };
        volunteerStorage.insert(userId, volunteer);
        return Ok(volunteer);
    }),

    //get volunteer
    getVolunteer: query([text], Opt(Volunteer), (userId) => {
        return volunteerStorage.get(userId);
    }),

    //get all volunteers
    getVolunteers: query([], Vec(Volunteer), () => {
        return volunteerStorage.values();
    }),

    //add to watchlist
    addToWatchlist: update([watchlist], Result(watchlist, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ NotFound: "invalid payoad" });
        }
        const incidentId = uuidv4();
        const watch = {
        id: incidentId,
        ...payload,
        };
        incidentsStorage.insert(incidentId, watch);
        return Ok(watch);
    }),

    //get users on watchlist
    getWatchlist: query([], Vec(watchlist), () => {
        return incidentsStorage.values();
    }),



});
