import React, { useEffect, useState } from 'react';
import { Box, List } from '@material-ui/core';
import { MessageGroup } from '../../../../common/typings/messages';
import Nui from '../../../../os/nui-events/utils/Nui';
import useMessages from '../../hooks/useMessages';
import MessageGroupItem from './MessageGroupItem';
import useStyles from './list.styles';
import { useHistory } from 'react-router-dom';
import { goToConversation } from '../../utils/goToConversation';
import { SearchField } from '../../../../ui/components/SearchField';
import { useTranslation } from 'react-i18next';

const MessagesList = (): any => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const { messageGroups, createMessageGroupResult, clearMessageGroupResult } = useMessages();

  const [searchValue, setSearchValue] = useState('');

  const formattedSearch = searchValue.toLowerCase().trim();
  const filteredGroups = formattedSearch
    ? messageGroups.filter((group) => {
        const groupDisplay = group.groupDisplay.toLowerCase();
        const displayIncludes = groupDisplay.includes(formattedSearch);

        const label = group.label?.toLowerCase();
        return label ? displayIncludes || label.includes(formattedSearch) : displayIncludes;
      })
    : messageGroups;

  useEffect(() => {
    if (createMessageGroupResult?.groupId) {
      const findGroup = messageGroups.find((g) => g.groupId === createMessageGroupResult.groupId);
      clearMessageGroupResult();
      if (findGroup) {
        goToConversation(findGroup, history);
      }
    }
  }, [messageGroups, createMessageGroupResult, clearMessageGroupResult, history]);

  if (!messageGroups) return null;

  const handleClick = (messageGroup: MessageGroup) => () => {
    Nui.send('phone:fetchMessages', { groupId: messageGroup.groupId });
    goToConversation(messageGroup, history);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <SearchField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t('APPS_MESSAGES_SEARCH_PLACEHOLDER')}
        />
      </Box>
      <Box display="flex" flexDirection="column">
        <Box className={classes.root}>
          <List>
            {filteredGroups.map((messageGroup) => (
              <MessageGroupItem
                key={messageGroup.groupId}
                messageGroup={messageGroup}
                handleClick={handleClick}
              />
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagesList;
