import { useState } from "react";
import axios from "axios";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

function TenantForm({ setTenant }) {
  const [authToken, setAuthToken] = useState("");

  const onAuthTokenChange = (e) => setAuthToken(e.target.value);

  const handleAuthTokenSubmit = async (e) => {
    const { data } = await axios.post(`/api/courier/verify`, { authToken });
    setTenant({ authToken, ...data });
  };

  return (
    <FormControl>
      <FormLabel>Courier Auth Token</FormLabel>
      <Input type="password" onChange={onAuthTokenChange} value={authToken} />
      <Button type="button" onClick={handleAuthTokenSubmit} colorScheme="blue">
        Submit
      </Button>
    </FormControl>
  );
}

function TenantView({ tenant }) {
  return <div>Tenant: {tenant.tenantName}</div>;
}

export default function CourierTenant({ tenant, setTenant }) {
  return (
    <>
      {tenant ? (
        <TenantView tenant={tenant} />
      ) : (
        <TenantForm setTenant={setTenant} />
      )}
    </>
  );
}
