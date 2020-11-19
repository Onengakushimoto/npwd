import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modalRoot: {
    zIndex: 10,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  modalHide: {
    display: 'none'
  },
  messageList: {
    height: '90%',
    overflowY: 'auto',
    paddingBottom: '25px',
  },
  messageContainer: {
    marginTop: 25,
    width: '100%'
  },
  sourceSms: {
    float: 'right',
    margin: 10,
    padding: '6px 12px',
    width: '80%',
    background: '#0288d1',
    borderRadius: '20px'
  },
  sms: {
    float: 'left',
    margin: 10,
    padding: '6px 12px',
    width: '80%',
    background: '#ddd',
    color: '#232323',
    borderRadius: '15px'
  }
}))

export default useStyles;