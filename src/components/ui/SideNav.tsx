import { Box, AppBar, Toolbar, Button } from '@mui/material';
import React, { useState, useContext, Fragment,useCallback } from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import SiderContainer from './SiderContainer';
import AuthContext from '../../store/auth-context';
import './SideNav.css';
import { useNavigate } from 'react-router-dom';
import AvatarGen from './AvatarGen';
import ContactsForm from '../Contacts/ContactsForm';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface SideNavProps {
  contacts: any;
  onFetch: () => void;
}

const defaultDrawerWidth = 340;
const minDrawerWidth = 50;
const maxDrawerWidth = 1000;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function SideNav({contacts,onFetch}: SideNavProps) {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [value,setValue] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [search, setSearch] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);
  const [inputText, setInputText] = useState("");

  const filteredData = contacts.filter((el: any) => {
    //if no input the return the original
    if (inputText === '') {
      return el;
    }
    //return the item which contains the user input
    else {
      return `${el.firstName} ${el.lastName}`.includes(inputText);
    }
})

  const [checkedState, setCheckedState] = useState<any>([]);
  console.log(checkedState);

  let inputHandler = (e : any) => {
    let lowerCase = e.target.value;
    setInputText(lowerCase);
  };

  const handleMouseDown = (e:React.MouseEvent<HTMLDivElement>) => {
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseMove = useCallback(e => {
    const newWidth = e.clientX - document.body.offsetLeft;
    if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
      setDrawerWidth(newWidth);
    }
  }, []);

  const logoutHandler = () => {
    authCtx.logout();
    navigate('/');
  };

  let arrayids: number[] = [];
  const deleteCustomerByIds = () => {
    console.log(checkedState);
    checkedState.forEach(d => {
      console.log(arrayids);
      arrayids.push(d.id);
    });
    // const ids = arrayids;
    console.log(arrayids);
    for(let h = 0; h < arrayids.length; h++) {
        let curItem = arrayids[h];
        let foundCount = 0;
        // search array for item
        for(let i = 0; i < arrayids.length; i++) {
            if (arrayids[i] === arrayids[h])
                foundCount++;
        }
        if(foundCount > 1) {
            // remove repeated item from new array
            for(let j = 0; j < arrayids.length; j++) {
                if(arrayids[j] === curItem) {                
                    arrayids.splice(j, 1);
                    j--;
                }
            }            
        }
    }
    console.log(arrayids);
    fetch(`https://anisoft.us/mailapp/api/mail/deletecontacts`, {
      method: 'POST',
      body: JSON.stringify({
        ids: arrayids,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': authCtx.token,
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
  };

  return (
    <Fragment>
      <AppBar position="fixed" sx={{ zIndex: (theme:any) => theme.zIndex.drawer + 1 }}>
        <Toolbar className='nav'>
          <Typography variant="h6" noWrap component="div">
            Contacts
          </Typography>
          <Button variant="contained" sx={{color:'#2196f3' ,backgroundColor: '#fff'}} className='btn' onClick={logoutHandler}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          className='drawer'
          PaperProps={{ style: { width: drawerWidth } }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <div className='toolbar' />
          <div onMouseDown={e => handleMouseDown(e)} className='dragger' />
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
          <div className='btn-side'>
            <Button sx={search ? {display: 'none'} : {}} variant="contained" onClick={() => {
              setIsClicked(true);
              setValue(null);
            }}>+ Add Contact</Button>
            <div className='btn-search'>
              <Search onClick={()=>{setSearch(prev => !prev);}}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={inputHandler}
                />
              </Search>
            </div>
          </div>
          <Button
          onClick={() => {
            deleteCustomerByIds();
          }}
          >
          Delete Contact
          </Button>
            <List>
              {filteredData.map((note:any) => (
                <ListItem className='box' button key={note.id} sx={value === note.id && !isClicked ? { borderLeft: '0.3rem solid #2196f3'}: {borderLeft: '0.3rem solid #fff'}} >
                  <Checkbox className='checkbox' {...label} 
                  value={`${note.firstName} ${note.lastName}`}
                  onChange={e => {
                    console.log(e.target.checked);
                    console.log(e.target.value);
                    console.log(note.id);
                    console.log(checkedState);
                    setCheckedState(prev => [...prev, {id: note.id, value: e.target.checked}]);
                  }}
                  />
                  <div className='container' onClick={()=>{
                    setValue(note.id);
                    setIsClicked(false);
                  }} >
                    <AvatarGen customClass='avatar' fullName={`${note.firstName} ${note.lastName}`} />
                    <SiderContainer id={note.id} title={`${note.firstName} ${note.lastName}`} value={value ? value : !isClicked && setValue(contacts[0].id)} />
                  </div>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {!isClicked && contacts.filter((contact:any)=> value === contact.id).map((contactVal:any) => (
            <ContactsForm id={contactVal.id} key={contactVal.id} firstName={contactVal.firstName} lastName={contactVal.lastName} onFetch={onFetch} />
          ))}
          {isClicked && <ContactsForm id='' firstName='' lastName='' onFetch={onFetch} />}
        </Box>
      </Box>
    </Fragment>
  )
}
