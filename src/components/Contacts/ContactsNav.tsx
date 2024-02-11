import {useState, useContext} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box,Button} from '@mui/material';
import classes from './ContactsNav.module.css';
import AuthContext from '../../store/auth-context';
import TextSnippetSharpIcon from '@mui/icons-material/TextSnippetSharp';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface contactsNavProps{
  id:string|number;
  contacts:any;
  isShow: boolean;
  onFetch: () => void;
}

const INITIAL_STATE = {
    id: 0,
    firstName: '',
    lastName: '',
    emailId: '',
    address: '',
    city: '',
    state: '',
    country: '',
    birthday: '',
    anniversary: '',
    notes: '',
  };

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ContactsNav({id, isShow, contacts, onFetch}:contactsNavProps) {

  const [value, setValue] = useState(0);
  const [noteOpen, setNoteOpen] = useState(false);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [user,setUser] = useState(INITIAL_STATE);
  const authContext = useContext(AuthContext);
  const { token } = authContext;
  const handleInput = (e : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> ) => {
    console.log(e.target.name, " : ", e.target.value);
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // if(user.emailId.length > 0 && user.firstName.length > 0 && user.lastName.length > 0){
      fetch('https://anisoft.us/mailapp/api/mail/contact', {
          method: 'POST',
          body: JSON.stringify({
          id: id ? id : user.id,
          emailId: contacts.emailId === '' || user.emailId.length > 0 ? user.emailId : contacts.emailId,
          firstName: contacts.firstName === '' || user.firstName.length > 0 ? user.firstName : contacts.firstName,
          lastName : contacts.lastName === '' || user.lastName.length > 0 ? user.lastName : contacts.lastName,
          address : contacts.address === '' || user.address.length > 0 ? user.address: contacts.address,
          city : contacts.city === '' || user.city.length > 0 ? user.city: contacts.city,
          state : contacts.state === '' || user.state.length > 0 ? user.state: contacts.state,
          country : contacts.country === '' || user.country.length > 0 ? user.country: contacts.country,
          birthday : contacts.birthday === '' || user.birthday.length > 0 ? user.birthday: contacts.birthday,
          anniversary : contacts.anniversary === '' || user.anniversary.length > 0 ? user.anniversary: contacts.anniversary,
          notes: contacts.notes === '' || user.notes.length > 0 ? user.notes: contacts.notes,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': token,
        },
      })
      .then((res) => {
        if (res.ok) {
          console.log(res);
          return res.text();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication failed!';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log(data);
        onFetch();
      })
      .catch((err) => {
        console.error(err.message);
        alert(err.message);
      });
    // }
    // else{
      // alert('Please fill the firstName, lastName and emailId.');
    // }
  };

const resetClickHandler = () => {
  onFetch();
}

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Contacts" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <form className={classes.forms}>
      <div className={classes.control}>
        <label
            htmlFor="first"
          >
            First Name
        </label>
        <input
          name='firstName'
          type="text"
          id="first"
          placeholder="Your FirstName"
          required
          defaultValue={contacts.firstName}
          onChange={handleInput}
        />
      </div>
      <div className={classes.control}>
        <label
            htmlFor="last"
          >
            Last Name
        </label>
        <input
          name='lastName'
          type="text"
          id="last"
          placeholder="Your LastName"
          required
          defaultValue={contacts.lastName}
          onChange={handleInput}
        />
      </div>
      <div className={classes.control}>
        <label
            htmlFor="email"
          >
            Email
        </label>
        <input
          name='emailId'
          type="email"
          id="email"
          placeholder="Your Email"
          required
          defaultValue={contacts.emailId}
          onChange={handleInput}
        />
      </div>
      <div className={classes.control}>
        <label
          htmlFor="birthday"
        >
          Birthday
        </label>
        <input
          name='birthday'
          type="date"
          id="birthday"
          placeholder="Your Birthday"
          required
          defaultValue={contacts.birthday}
          onChange={handleInput}
        />
      </div>
      <div className={classes.control}>
        <label
          htmlFor="anniversary"
        >
          Anniversary
        </label>
        <input
          name='anniversary'
          type="date"
          id="anniversary"
          placeholder="Your Anniversary"
          required
          defaultValue={contacts.anniversary}
          onChange={handleInput}
        />
      </div>
      </form>
      <div className={classes.notes}>
        <TextSnippetSharpIcon />
        <div>
          <span>Notes</span>
          <p className={classes.p} onClick={()=>setNoteOpen(prev => !prev)}>Add your own notes here</p>
        </div>
        </div>
        {noteOpen && <textarea
          name='notes'
          id="notes"
          className={classes.textarea}
          placeholder="Add Notes"
          required
          defaultValue={contacts.notes}
          onChange={handleInput}
        /> 
        }
      </TabPanel>
      <TabPanel value={value} index={1}>
      <form className={classes.forms}>
      <div className={classes.control}>
        <label
            htmlFor="address"
          >
            Address
        </label>
        <input
          name='address'
          type="text"
          id="address"
          placeholder="Your Address"
          required
          defaultValue={contacts.address}
          onChange={handleInput}
        />
      </div>
      <div className={classes.control}>
        <label
            htmlFor="city"
          >
            City
        </label>
        <input
          name='city'
          type="text"
          id="city"
          placeholder="Your City"
          required
          defaultValue={contacts.city}
          onChange={handleInput}
        />
      </div>
      <div className={classes.control}>
        <label
            htmlFor="state"
          >
            State
        </label>
        <input
          name='state'
          type="text"
          id="state"
          placeholder="Your State"
          required
          defaultValue={contacts.state}
          onChange={handleInput}
        />
      </div>
      <div className={classes.control}>
        <label
            htmlFor="country"
          >
            Country
        </label>
        <input
          name='country'
          type="text"
          id="country"
          placeholder="Your Country"
          required
          defaultValue={contacts.country}
          onChange={handleInput}
        />
      </div>
      </form>
      </TabPanel>
      {/* {!isValid && <p></p>} */}
      {!isShow && <Button variant="contained" onClick={handleSubmit}>Add</Button>}
      {isShow && 
      <div className={classes.btn}>
      <Button variant="contained" onClick={handleSubmit}>Update</Button>
      <Button variant="contained" onClick={resetClickHandler}>Reset</Button>
      </div>
      }
    </Box>
  );
}
