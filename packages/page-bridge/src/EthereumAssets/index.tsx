import { DestinationType } from '@polkadot/app-staking/Actions/types';
import { useTranslation } from '@polkadot/apps/translate';
import { useEtherAccounts } from '@polkadot/react-api/useEtherAccounts';
import { Button, Card, Columar, Dropdown, InputAddress, InputNumber, Modal } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { createAccountsOpt } from './EthereumAccounts';

interface Props {
    className?: string;
    setEthereumAddress: () => void
}

function EthereumAssets ({ className = '', setEthereumAddress }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const [destination, setDestination] = useState<DestinationType>('Staked');
    const { data: accounts = [] } = useEtherAccounts()
    const [approveModalShow, toggleApproveModalShow] = useToggle(false);

    const options = useMemo(
        () => createAccountsOpt(accounts),
        [accounts]
    );

    return (<div className={className}>
        <Card>
            <Columar>
                <Modal.Content>
                    From: <Dropdown
                        label={'eth account'}
                        defaultValue={0}
                        onChange={setEthereumAddress}
                        options={options}
                        value={destination}
                    />
                    TO: <InputAddress
                            help={t<string>('The selected account to perform the derivation on.')}
                            label={t<string>('derive root account')}
                        />
                    Amount: <InputNumber
                        help={t<string>('The threshold of vouches that is to be reached for the account to be recovered.')}
                        label={t<string>('recovery threshold')}
                    />
                    <Button.Group>
                        <Button
                            icon='paper-plane'
                            label={t<string>('Approve')}
                            onClick={toggleApproveModalShow}
                        />
                    </Button.Group>
                </Modal.Content>
            </Columar>
        </Card>
    </div>)
}

export default React.memo(styled(EthereumAssets)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);

