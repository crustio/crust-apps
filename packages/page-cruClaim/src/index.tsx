import React, { useCallback, useState } from "react";
import { AppProps as Props } from "@polkadot/react-components/types";
import { Button, Card, Input } from "@polkadot/react-components";
import { useTranslation } from "@polkadot/app-claims/translate";
// @ts-ignore
import { httpPost } from './http';
import HttpStatus from "./HttpStatus";

function CruClaimsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [ethereumTx, setEthereumTx] = useState<string | undefined | null>(null);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const onChangeEthereumTx = useCallback((value: string) => {
    // FIXME We surely need a better check than just a trim
    setEthereumTx(value.trim());
  }, []);

  const goToStepClaim = useCallback(async () => {
    const result = await httpPost('http://localhost:3030/api/postTest', { tx: ethereumTx } );
    setStatusOpen(true);
    setResult(JSON.stringify(result));
    setStatus(result.status);
  }, [ethereumTx]);

  return (<Card withBottomMargin>
      <h3>{t<string>('Enter the ETH Transaction hash')}</h3>
      <Input
        autoFocus
        className='full'
        help={t<string>('The transaction hash you send in Ethereum (starting by "0x")')}
        label={t<string>('ETH Transaction hash')}
        onChange={onChangeEthereumTx}
        value={ethereumTx || ''}
      />
      {(
        <Button.Group>
          <Button
            icon='sign-in-alt'
            isDisabled={!ethereumTx}
            label={t<string>('Confirm claim')}
            onClick={goToStepClaim}
          />
        </Button.Group>
      )}
      <HttpStatus
        isStatusOpen={statusOpen}
        setStatusOpen={setStatusOpen}
        message={result}
        status={status}
      />
    </Card>
  );
}

export default React.memo(CruClaimsApp);
