import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast
} from "@chakra-ui/react";
import { FaTwitter } from "react-icons/fa";
import { useRouter } from "next/router";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

export default function Twitter() {
  const toast = useToast();
  const { query = {} } = useRouter();
  const [recipientId, setRecipientId] = useState("");
  const [authToken, setAuthToken] = useState("");
  const { oauth_token, oauth_token_secret, user_id, handle } = query;
  const profile = {
    twitter: { oauth_token, oauth_token_secret, user_id, handle }
  };

  const onRecipientIdChange = (e) => setRecipientId(e.target.value);
  const onAuthTokenChange = (e) => setAuthToken(e.target.value);

  const handleProfileSave = async (e) => {
    const { data } = await axios.post(`/api/courier/saveProfile`, {
      authToken,
      recipientId,
      profile
    });
    toast({
      title: "Profile saved.",
      description: "We've created the profile for you.",
      status: "success",
      duration: 9000,
      isClosable: true
    });
  };

  return (
    <Container>
      <Head>
        <title>Courier Profile-inator: Twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {oauth_token ? (
          <>
            <Heading as="h1">Save your Twitter Profile</Heading>
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
            <FormControl>
              <FormLabel>Courier Auth Token</FormLabel>
              <Input onChange={onAuthTokenChange} value={authToken} />
            </FormControl>
            <FormControl>
              <FormLabel>Recipient Id</FormLabel>
              <Input onChange={onRecipientIdChange} value={recipientId} />
            </FormControl>
            <Button
              type="button"
              onClick={handleProfileSave}
              colorScheme="blue"
            >
              Save Profile
            </Button>
          </>
        ) : (
          <>
            <Heading as="h1">Sign into your Twitter Account</Heading>
            <Button
              as="a"
              href="/api/twitter/auth"
              colorScheme="twitter"
              leftIcon={<FaTwitter />}
            >
              Sign in to Twitter
            </Button>
          </>
        )}
      </main>
    </Container>
  );
}
