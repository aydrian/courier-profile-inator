import Head from "next/head";
import axios from "axios";
import { useState } from "react";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  useToast,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Checkbox,
  CheckboxGroup,
  Stack
} from "@chakra-ui/react";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

import DiscordBot from "@components/DiscordBot";
import CourierTenant from "@components/CourierTenant";

export default function Home() {
  const toast = useToast();
  const [bot, setBot] = useState();
  const [server, setServer] = useState("");
  const [channels, setChannels] = useState([]);
  const [members, setMemebers] = useState([]);
  const [tenant, setTenant] = useState();
  const [profile, setProfile] = useState();
  const [recipientId, setRecipientId] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [checkRecipients, setCheckedRecipients] = useState([]);
  const [list, setList] = useState("");

  const handleTabsChange = async (index) => {
    if (index === 0) {
      if (channels.length === 0) {
        const { data } = await axios.post(`/api/discord/listChannels`, {
          botToken: bot.botToken,
          guildId: server
        });

        setChannels(data);
      }
    } else if (index === 1) {
      if (members.length === 0) {
        const { data } = await axios.post(`/api/discord/listMembers`, {
          botToken: bot.botToken,
          guildId: server
        });

        setMemebers(data);
      }
    }
    setProfile(null);
    setTabIndex(index);
  };

  const handleServerChange = async (e) => {
    const guildId = e.target.value;
    setServer(e.target.value);
    if (guildId) {
      const { data } = await axios.post(`/api/discord/listChannels`, {
        botToken: bot.botToken,
        guildId
      });

      setChannels(data);
    } else {
      setTabIndex(0);
      setProfile(null);
      setChannels([]);
      setMemebers([]);
    }
  };

  const handleChannelChange = async (e) => {
    setProfile({
      discord: { channel_id: e.target.value }
    });
  };

  const handleMemberChange = async (e) => {
    setProfile({
      discord: { user_id: e.target.value }
    });
  };

  const onRecipientIdChange = (e) => setRecipientId(e.target.value);

  const handleProfileSave = async (e) => {
    const { data } = await axios.post(`/api/courier/saveProfile`, {
      authToken: tenant.authToken,
      recipientId,
      profile
    });
    const filtered = recipients.filter(
      (recipient) => recipient.recipientId !== recipientId
    );
    setRecipients([...filtered, data]);
    toast({
      title: "Profile saved.",
      description: "We've created the profile for you.",
      status: "success",
      duration: 9000,
      isClosable: true
    });
  };

  const onRecipientsChanged = (value) => setCheckedRecipients(value);

  const onListChanged = (e) => setList(e.target.value);

  const handleSubscribe = async (e) => {
    if (list && checkRecipients) {
      await axios.post(`/api/courier/subscribe`, {
        authToken: tenant.authToken,
        list,
        recipientIds: checkRecipients
      });
      toast({
        title: "List updated.",
        description: "We've subscribed the recipients to the list.",
        status: "success",
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <Container>
      <Head>
        <title>Courier Profile-inator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Heading as="h1">Courier Profile-inator</Heading>
        <p className="description">Generate Discord Profiles for Courier.</p>
        <DiscordBot bot={bot} setBot={setBot} />
        {bot && (
          <div>
            <Select placeholder="Select Server" onChange={handleServerChange}>
              {bot.guilds.map((guild) => {
                return (
                  <option key={guild.id} value={guild.id}>
                    {guild.name}
                  </option>
                );
              })}
            </Select>
            {server && (
              <Tabs isLazy index={tabIndex} onChange={handleTabsChange}>
                <TabList>
                  <Tab>Channels</Tab>
                  <Tab>Users</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Select
                      placeholder="Select Channel"
                      onChange={handleChannelChange}
                    >
                      {channels
                        .filter((channel) => {
                          return channel.type === 0;
                        })
                        .map((channel) => {
                          return (
                            <option key={channel.id} value={channel.id}>
                              # {channel.name}
                            </option>
                          );
                        })}
                    </Select>
                  </TabPanel>
                  <TabPanel>
                    <Select
                      placeholder="Select User"
                      onChange={handleMemberChange}
                    >
                      {members.map((member) => {
                        return (
                          <option key={member.user.id} value={member.user.id}>
                            {member.nick || member.user.username} (
                            {member.user.username}#{member.user.discriminator})
                          </option>
                        );
                      })}
                    </Select>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}

            {profile && (
              <>
                <Box rounded="8px" my="8" bg="#011627">
                  <Editor
                    value={JSON.stringify(profile, null, 2)}
                    highlight={(code) =>
                      highlight(code, Prism.languages.json, "json")
                    }
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 12
                    }}
                  />
                </Box>
                <CourierTenant tenant={tenant} setTenant={setTenant} />
                {tenant && (
                  <FormControl>
                    <FormLabel>Recipient Id</FormLabel>
                    <Input onChange={onRecipientIdChange} value={recipientId} />
                    <Button
                      type="button"
                      onClick={handleProfileSave}
                      colorScheme="blue"
                    >
                      Save Profile
                    </Button>
                  </FormControl>
                )}
                {tenant && recipients.length > 0 && (
                  <div>
                    <h2>Recipients</h2>
                    <CheckboxGroup onChange={onRecipientsChanged}>
                      <Stack>
                        {recipients.map((recipient) => {
                          return (
                            <Checkbox
                              value={recipient.recipientId}
                              key={recipient.recipientId}
                            >
                              {recipient.recipientId}
                            </Checkbox>
                          );
                        })}
                      </Stack>
                    </CheckboxGroup>
                    <Select placeholder="Select List" onChange={onListChanged}>
                      {tenant.lists.map((list) => {
                        return (
                          <option key={list.id} value={list.id}>
                            {list.name || list.id}
                          </option>
                        );
                      })}
                    </Select>
                    <Button
                      type="button"
                      onClick={handleSubscribe}
                      colorScheme="blue"
                    >
                      Add to List
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </Container>
  );
}
