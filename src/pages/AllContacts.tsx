import { useState, useEffect, useContext, useCallback, Fragment } from 'react';
import AuthContext from '../store/auth-context';
import SideNav from '../components/ui/SideNav';

const AllContacts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedContacts, setLoadedContacts] = useState<any>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetch(' https://anisoft.us/mailapp/api/mail/getcontacts', {
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
        const contacts: any = [];
        for (const key in data) {
          const contact: any = {
            id: key,
            ...data[key],
          };
          contacts.push(contact);
        }
        setIsLoading(false);
        setLoadedContacts(contacts);
        console.log(contacts);
      });
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Fragment>
    {!isLoading && <SideNav contacts={loadedContacts} onFetch={fetchData} />}
    {isLoading && <p>Loading...</p>}
    </Fragment>
  );
};

export default AllContacts;
