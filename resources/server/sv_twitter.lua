ESX = nil

function printO(o)
    for key, value in pairs(o) do
        print(key, value)
    end
end

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)

ESX.RegisterServerCallback('phone:fetchTweets', function(source, cb)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    MySQL.Async.fetchAll('SELECT * FROM npwd_twitter_tweets WHERE visible = 1 ORDER BY updatedAt DESC', {}, function(tweets)
        cb(tweets)
    end)
end)


ESX.RegisterServerCallback('phone:createTweet', function(source, cb, data) 
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()

    MySQL.Async.execute('INSERT INTO npwd_twitter_tweets (`identifier`, `realUser`, `message`, `images`) VALUES (@identifier, @realUser, @message, @images)', 
    {  
        ['identifier'] = _identifier,
        ['realUser']  = data.realUser,
        ['message']  = data.message,
        ['images'] = data.images
    }, function(result) 
        cb(result)
    end)
end)

function getProfile(identifier, cb)
    MySQL.Async.fetchAll('SELECT * FROM npwd_twitter_profiles WHERE identifier = @identifier', 
    {  
        ['identifier'] = identifier,
    }, function(result)
        cb(result)
    end)
end

function getProfileName(identifier, cb)
    local defaultProfileName = '' -- handle any edge cases where the user does not exist or their name isn't populated
    MySQL.Async.fetchAll('SELECT first_name, last_name FROM users WHERE identifier = @identifier LIMIT 1',  {['identifier'] = identifier }, function(users)
        -- no user found with this identifier
       if next(users) == nil then
           cb(defaultProfileName)
           return
       end

       local first_name = users[1].first_name
       local last_name = users[1].last_name
       if (first_name == "" and last_name == "") then
            cb(defaultProfileName)
        else
            local profileName = first_name .. '_' .. last_name
            cb(profileName)
        end
    end)
end

function createDefaultProfile(identifier, cb)
    getProfileName(identifier, function(profileName)
        MySQL.Async.execute('INSERT INTO npwd_twitter_profiles (`identifier`, `profile_name`) VALUES (@identifier, @profile_name)', 
        {  
            ['identifier'] = identifier,
            ['profile_name'] = profileName,
        }, function(result)
            if result == 1 then  -- if we created the profile then return it
                getProfile(identifier, cb)
            else -- otherwise just give back the failed result
                cb(result)
            end
        end)
    end)
end

-- Retrieve a twitter profile by identifier. If it does not exist then
-- create and return it
function getOrCreateProfile(identifier, cb)
    getProfile(identifier, function(retrieveResult)
        if next(retrieveResult) == nil then -- profile does not exist, attempt to create it
            createDefaultProfile(identifier, function(createResult)
                cb(createResult)
            end)
        else -- profile does exist
            cb(retrieveResult)
        end
    end)
end

ESX.RegisterServerCallback('phone:getOrCreateTwitterProfile', function(source, cb) 
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()

    getOrCreateProfile(_identifier, function(result)
        cb(result)
    end)
end)
