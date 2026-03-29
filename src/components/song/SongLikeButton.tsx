// SPDX-License-Identifier: Apache-2.0
// Original: Copyright 2021 Yasuaki Uechi (Musicdex)
// Modified: Copyright 2026 fresh-tsukushi-dev (KMNdex)
// See CHANGES file for details.

import { IconButton, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  useSongLikeUpdater,
  useSongLikeBulkCheck,
} from "../../modules/services/like.service";

const ChakraIconButton: any = IconButton;

type SongLikeButtonProps = {
  song: Song;
  size?: number;
  [key: string]: any;
};

export function SongLikeButton({
  song,
  size = 16,
  ...rest
}: SongLikeButtonProps) {
  const toast = useToast();
  const { t } = useTranslation();
  const {
    mutate: updateLike,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useSongLikeUpdater();
  const { data: isLiked } = useSongLikeBulkCheck(song.id);

  useEffect(() => {
    if (isLoading || (!isSuccess && !isError)) return; // Check if in progress
    if (isSuccess) return; // Do not show toast on success

    const isUnauthorized = error.response?.status === 401;
    if (isUnauthorized) {
      toast({
        position: "top-right",
        duration: 5000,
        isClosable: true,
        render: ({ onClose }) => (
          <div
            style={{
              background: "var(--chakra-colors-brand-600)",
              color: "white",
              padding: "12px 40px 12px 12px",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
              position: "relative",
              maxWidth: "420px",
            }}
          >
            <div style={{ fontWeight: 600 }}>{t("You are not logged in")}</div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                right: "8px",
                top: "8px",
                width: "24px",
                height: "24px",
                lineHeight: "24px",
                textAlign: "center",
                borderRadius: "6px",
                border: "none",
                background: "transparent",
                color: "white",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ),
      });
      return;
    }

    toast({
      title: t("An error has occurred"),
      status: "error",
      duration: 5000,
      position: "top-right",
      isClosable: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSuccess, isError, toast]);

  function toggleLike() {
    updateLike({
      song_id: song.id,
      action: isLiked ? "delete" : "add",
    });
  }

  return (
    <motion.span
      whileHover={{ scale: 1.0 }}
      whileTap={{ scale: 0.8 }}
      style={{ display: "inline-block" }}
    >
      <ChakraIconButton
        width="20px"
        margin={-2}
        icon={isLiked ? <FaHeart size={size} /> : <FaRegHeart size={size} />}
        onClick={toggleLike}
        colorScheme={"brand"}
        variant="ghost"
        opacity={isLiked ? 1 : 0.3}
        aria-label="Like Song"
        {...(rest as any)}
      ></ChakraIconButton>
    </motion.span>
  );
}
