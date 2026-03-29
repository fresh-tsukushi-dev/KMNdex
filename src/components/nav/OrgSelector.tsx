// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useServerOrgList } from "../../modules/services/statics.service";
import { useStoreActions, useStoreState } from "../../store";
import { Org } from "../../store/org";
import { MotionBox } from "../common/MotionBox";
import { OrgPickerPanel } from "../settings/OrgManagement";
import { RK_SINGLE_CHANNEL_MODE } from "../../config/rkmusic";
import type { ChangeEvent } from "react";

const EMPTY_ORGS: Org[] = [];

export const useOrgPath = () => {
  const org = useStoreState((state) => state.org.currentOrg);
  if (RK_SINGLE_CHANNEL_MODE) {
    return `/`;
  }
  return `/org/${org.name}`;
};

export function OrgSelector() {
  const org = useStoreState((state) => state.org.currentOrg);
  const setOrg = useStoreActions((state) => state.org.setOrg);
  const orglist = useStoreState((s) => s.org.orgsList);
  const navigate = useNavigate();

  const isSingleChannelMode = RK_SINGLE_CHANNEL_MODE;
  const orgListQuery = useServerOrgList({ enabled: !isSingleChannelMode });
  const orgs: Org[] = orgListQuery.data ?? EMPTY_ORGS;

  const { t } = useTranslation();
  const usableOrgs: Org[] = useMemo(() => {
    const otherOrg: Org = { name: t("... Other Orgs"), name_jp: "", short: "" };
    return orglist
      ? [
          ...(orglist
            .map((x) => orgs.find((o) => o.name === x))
            .filter((x) => !!x) as Org[]),
          otherOrg,
          ...(orglist.includes(org.name) ? [] : [org]),
        ]
      : [otherOrg, org];
  }, [org, orglist, orgs, t]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (isSingleChannelMode) return null;

  return (
    <>
      <MotionBox
        opacity={0}
        animate={{
          scale: [0.9, 1],
          opacity: [0, 1],
          marginTop: ["-30px", "0px"],
        }}
        exit={{ opacity: 0, height: "0px" }}
        transition={{ duration: 0.4, type: "tween" }}
        px={2}
        mb={1}
      >
        <Select
          value={org.name}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const tgt = orgs.find((x) => x.name === e.target.value);
            if (tgt) {
              setOrg(tgt);
              navigate(`/org/${tgt.name}`);
            } else onOpen();
          }}
        >
          {usableOrgs?.map((x) => {
            return (
              <option key={x.name + "opt_os"} value={x.name}>
                {x.name}
              </option>
            );
          })}
        </Select>
      </MotionBox>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          minWidth="400px"
          maxWidth="100vw"
          maxH="70vh"
          overflowY="auto"
          overflowX="hidden"
          width="auto"
          backgroundColor="gray.900"
        >
          <ModalHeader>Select an org:</ModalHeader>
          <ModalCloseButton />
          <ModalBody width="auto">
            <OrgPickerPanel
              pickOrg={(org) => {
                if (org) {
                  setOrg(org);
                  navigate(`/org/${org.name}`);
                }
                onClose();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
