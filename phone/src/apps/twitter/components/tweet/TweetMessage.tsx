import React, { memo, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import { getNewLineCount } from '../../utils/message';
import { TextField } from '../../../../ui/components/Input';

const useStyles = makeStyles({
  textField: {
    flex: '1 1 100%',
    padding: '10px 15px',
    marginTop: '15px',
    overflowY: 'auto',
    maxHeight: '300px',
  },
  textFieldInput: {
    fontSize: '22px',
    paddingTop: '8px',
  },
});

export const TweetMessage = ({ modalVisible, message, handleChange }) => {
  const textFieldInputRef = useRef(null);
  const classes = useStyles();
  const { ResourceConfig } = usePhone();
  const [t] = useTranslation();

  const { characterLimit, newLineLimit } = ResourceConfig.twitter;

  if (!ResourceConfig) return null;

  let errorMessage = null;

  const overCharacterLimit = message.trim().length > characterLimit;
  const characterWarningPrompt = `${t(
    'APPS_TWITTER_TWEET_MESSAGE_CHAR_LIMIT',
  )} (${characterLimit})`;

  const overNewLineLimit = getNewLineCount(message) > newLineLimit;
  const newLineWarningPrompt = `${t(
    'APPS_TWITTER_TWEET_MESSAGE_NEW_LINE_LIMIT',
  )} (${newLineLimit})`;

  if (overCharacterLimit) {
    errorMessage = characterWarningPrompt;
  } else if (overNewLineLimit) {
    errorMessage = newLineWarningPrompt;
  }

  return (
    <TextField
      value={message}
      inputProps={{ className: classes.textFieldInput }}
      className={classes.textField}
      onChange={(e) => handleChange(e.currentTarget.value)}
      multiline
      placeholder={t('APPS_TWITTER_TWEET_MESSAGE_PLACEHOLDER')}
      inputRef={textFieldInputRef}
      error={errorMessage !== null}
      helperText={errorMessage || null}
    />
  );
};

export default memo(TweetMessage);
