import { Fragment} from 'react';
import ListItemText from '@mui/material/ListItemText';


interface SiderContainerProps {
  id: number;
  title: string;
  value:any;
}

const text = {
  fontWeight: "900",
};

const SiderContainer = ({ title, value, id}: SiderContainerProps) => {
  
  return (
    <Fragment>
      <ListItemText sx={{marginLeft:'0.8rem'}} primaryTypographyProps={value === id ? { style: text }: {}} primary={title} />
    </Fragment>
  )
};

export default SiderContainer;
