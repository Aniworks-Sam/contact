import { Fragment, useCallback, useEffect,useContext,useState } from 'react';
import classes from './ContactsForm.module.css';
import AvatarGen from '../ui/AvatarGen';
import ContactsNav from './ContactsNav';
import AuthContext from '../../store/auth-context';
interface contactsFormProps{
  id:string|number;
  firstName: string;
  lastName: string;
  onFetch: () => void;
}

export default function ContactsForm({id,firstName, lastName, onFetch}:contactsFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [loadedContacts, setLoadedContacts] = useState<any>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  
  const fetchData = useCallback(() => {
    setIsLoading(true);
    if(id){
    setIsShow(true);
    fetch(`https://anisoft.us/mailapp/api/mail/getcontactbyid?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token,
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setIsLoading(false);
        setLoadedContacts(data);
      });
    }
    else{
      setIsShow(false);
      setIsLoading(false);
    }
  }, [token,id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Fragment>
      {isShow && <div className={classes.header}>
        <AvatarGen customClass={classes.avatar} fullName={`${firstName} ${lastName}`} />
        <h1>{`${firstName} ${lastName}`}</h1>
      </div>}
      {!isShow && <div className={classes['header-normal']}>
        <h1>Add Contact</h1>
      </div>}
      {!isLoading && <ContactsNav id={id} isShow={isShow} contacts={loadedContacts} onFetch={onFetch} />}
      {isLoading && <p>Loading...</p>}
    </Fragment>
  );
}
