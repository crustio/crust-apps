// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import StatusContext from "../../../../react-components/src/Status/Context";
import { useTranslation } from "react-i18next";
interface Props {
  text: string;
  message: string;
  children?: React.ReactNode;
  onCopy?: () => void}

const CopyButton:React.FC<Props> = ({ text, children, onCopy, message }) => {
  const { t } = useTranslation("order");
  const { queueAction } = useContext(StatusContext);
  const _onCopy = useCallback(() => {
    onCopy && onCopy();
    queueAction &&
      queueAction({
        action: t("clipboard"),
        message,
        status: "queued"
      });
  }, [queueAction, t]);

  return (
    <CopyToClipboard text={text.toString()} onCopy={_onCopy}>
      {children}
    </CopyToClipboard>
  );
};
export default CopyButton;
