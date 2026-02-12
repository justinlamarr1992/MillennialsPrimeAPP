import React from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { COLORS, Colors } from "@/constants/Colors";
import { globalStyles } from "@/constants/global";
import type { ConnectionStatus } from "@/types/connection";

/** Extracts only keys from Colors whose values are strings (excludes gradient arrays) */
type ColorKey = { [K in keyof Colors]: Colors[K] extends string ? K : never }[keyof Colors];

export interface ConnectionButtonProps {
  status: ConnectionStatus;
  connectionId?: string;
  loading: boolean;
  onSendRequest: () => void;
  onAcceptRequest: (connectionId: string) => void;
  onDeclineRequest: (connectionId: string) => void;
  onRemoveConnection: (connectionId: string) => void;
}

interface SingleButtonConfig {
  label: string;
  accessibilityLabel: string;
  bgColor: ColorKey;
  textColor: ColorKey;
  disabled?: boolean;
}

const BUTTON_CONFIG: Record<Exclude<ConnectionStatus, "pending_received">, SingleButtonConfig> = {
  none: {
    label: "Connect",
    accessibilityLabel: "Send connection request",
    bgColor: "priC",
    textColor: "secT",
  },
  pending_sent: {
    label: "Pending",
    accessibilityLabel: "Connection request pending",
    bgColor: "regC",
    textColor: "priT",
    disabled: true,
  },
  connected: {
    label: "Connected",
    accessibilityLabel: "Remove connection",
    bgColor: "quiC",
    textColor: "priT",
  },
};

const getHandler = (
  status: ConnectionStatus,
  connectionId: string | undefined,
  props: ConnectionButtonProps
): (() => void) | undefined => {
  if (status === "none") return props.onSendRequest;
  if (status === "connected" && connectionId) return () => props.onRemoveConnection(connectionId);
  return undefined;
};

export default function ConnectionButton(props: ConnectionButtonProps): JSX.Element {
  const { status, connectionId, loading, onAcceptRequest, onDeclineRequest } = props;
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme ?? "dark"];

  if (loading) {
    return (
      <View
        style={[globalStyles.padding, globalStyles.flexAlignItemsCenter, globalStyles.flexJustifyContentCenter]}
        testID="connection-button-loading"
      >
        <ActivityIndicator size="small" color={colors.priC} />
      </View>
    );
  }

  if (status === "pending_received") {
    return (
      <View style={globalStyles.padding}>
        <View style={[globalStyles.flexRow, { gap: 12 }]}>
          <Pressable
            style={[globalStyles.button, globalStyles.flex1, { backgroundColor: colors.priC }]}
            onPress={() => connectionId && onAcceptRequest(connectionId)}
            accessibilityRole="button"
            accessibilityLabel="Accept connection request"
          >
            <Text style={[globalStyles.buttonText, { color: colors.secT }]}>
              Accept
            </Text>
          </Pressable>
          <Pressable
            style={[globalStyles.button, globalStyles.flex1, { backgroundColor: colors.regC }]}
            onPress={() => connectionId && onDeclineRequest(connectionId)}
            accessibilityRole="button"
            accessibilityLabel="Decline connection request"
          >
            <Text style={[globalStyles.buttonText, { color: colors.priT }]}>
              Decline
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const config = BUTTON_CONFIG[status];
  const handler = getHandler(status, connectionId, props);

  return (
    <View style={globalStyles.padding}>
      <Pressable
        style={[globalStyles.button, { backgroundColor: colors[config.bgColor] }]}
        onPress={handler}
        disabled={config.disabled}
        accessibilityRole="button"
        accessibilityLabel={config.accessibilityLabel}
        accessibilityState={config.disabled ? { disabled: true } : undefined}
      >
        <Text style={[globalStyles.buttonText, { color: colors[config.textColor] }]}>
          {config.label}
        </Text>
      </Pressable>
    </View>
  );
}
