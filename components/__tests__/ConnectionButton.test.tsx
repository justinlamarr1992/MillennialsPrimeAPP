import React from "react";
import { render, screen, fireEvent } from "@/__tests__/test-utils";
import ConnectionButton from "../ConnectionButton";
import type { ConnectionStatus } from "@/types/connection";

describe("ConnectionButton", () => {
  const mockOnSendRequest = jest.fn();
  const mockOnAcceptRequest = jest.fn();
  const mockOnDeclineRequest = jest.fn();
  const mockOnRemoveConnection = jest.fn();

  const defaultProps = {
    status: "none" as ConnectionStatus,
    loading: false,
    onSendRequest: mockOnSendRequest,
    onAcceptRequest: mockOnAcceptRequest,
    onDeclineRequest: mockOnDeclineRequest,
    onRemoveConnection: mockOnRemoveConnection,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given the connection status is 'none'", () => {
    it("should render a Connect button", () => {
      render(<ConnectionButton {...defaultProps} status="none" />);

      expect(screen.getByText("Connect")).toBeTruthy();
    });

    it("should call onSendRequest when Connect is pressed", () => {
      render(<ConnectionButton {...defaultProps} status="none" />);

      fireEvent.press(screen.getByText("Connect"));

      expect(mockOnSendRequest).toHaveBeenCalledTimes(1);
    });

    it("should have an accessible Connect button", () => {
      render(<ConnectionButton {...defaultProps} status="none" />);

      expect(screen.getByLabelText("Send connection request")).toBeTruthy();
    });
  });

  describe("Given the connection status is 'pending_sent'", () => {
    it("should render a Pending button", () => {
      render(<ConnectionButton {...defaultProps} status="pending_sent" />);

      expect(screen.getByText("Pending")).toBeTruthy();
    });

    it("should disable the Pending button", () => {
      render(<ConnectionButton {...defaultProps} status="pending_sent" />);

      const button = screen.getByLabelText("Connection request pending");
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true })
      );
    });

    it("should not call any handler when Pending is pressed", () => {
      render(<ConnectionButton {...defaultProps} status="pending_sent" />);

      fireEvent.press(screen.getByText("Pending"));

      expect(mockOnSendRequest).not.toHaveBeenCalled();
      expect(mockOnAcceptRequest).not.toHaveBeenCalled();
    });
  });

  describe("Given the connection status is 'pending_received'", () => {
    const connectionId = "conn-abc-123";
    const renderPendingReceived = () =>
      render(
        <ConnectionButton
          {...defaultProps}
          status="pending_received"
          connectionId={connectionId}
        />
      );

    it("should render Accept and Decline buttons", () => {
      renderPendingReceived();

      expect(screen.getByText("Accept")).toBeTruthy();
      expect(screen.getByText("Decline")).toBeTruthy();
    });

    it("should call onAcceptRequest with connectionId when Accept is pressed", () => {
      renderPendingReceived();
      fireEvent.press(screen.getByText("Accept"));

      expect(mockOnAcceptRequest).toHaveBeenCalledWith(connectionId);
    });

    it("should call onDeclineRequest with connectionId when Decline is pressed", () => {
      renderPendingReceived();
      fireEvent.press(screen.getByText("Decline"));

      expect(mockOnDeclineRequest).toHaveBeenCalledWith(connectionId);
    });

    it("should have accessible Accept and Decline buttons", () => {
      renderPendingReceived();

      expect(screen.getByLabelText("Accept connection request")).toBeTruthy();
      expect(screen.getByLabelText("Decline connection request")).toBeTruthy();
    });
  });

  describe("Given the connection status is 'connected'", () => {
    const connectionId = "conn-xyz-789";
    const renderConnected = () =>
      render(
        <ConnectionButton
          {...defaultProps}
          status="connected"
          connectionId={connectionId}
        />
      );

    it("should render a Connected button", () => {
      renderConnected();

      expect(screen.getByText("Connected")).toBeTruthy();
    });

    it("should call onRemoveConnection with connectionId when pressed", () => {
      renderConnected();
      fireEvent.press(screen.getByText("Connected"));

      expect(mockOnRemoveConnection).toHaveBeenCalledWith(connectionId);
    });

    it("should have an accessible Connected button", () => {
      renderConnected();

      expect(screen.getByLabelText("Remove connection")).toBeTruthy();
    });
  });

  describe("Given the component is in a loading state", () => {
    it("should show a loading indicator", () => {
      render(<ConnectionButton {...defaultProps} loading={true} />);

      expect(screen.getByTestId("connection-button-loading")).toBeTruthy();
    });

    it("should not render action buttons while loading", () => {
      render(<ConnectionButton {...defaultProps} loading={true} />);

      expect(screen.queryByText("Connect")).toBeNull();
      expect(screen.queryByText("Pending")).toBeNull();
      expect(screen.queryByText("Connected")).toBeNull();
    });
  });
});
