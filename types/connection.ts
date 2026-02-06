/**
 * TypeScript interfaces for the connection/social system
 * Maps to server's Connection MongoDB model (Issue #52)
 *
 * Backend Implementation Status: NOT YET IMPLEMENTED
 * Tracked in: GitHub Issues #52, #53
 */

/** Connection record between two users */
export interface Connection {
  _id: string;
  requester: string; // userId who sent the request
  recipient: string; // userId who received the request
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
}

/** Connection status between the current user and a target user */
export type ConnectionStatus =
  | 'none'           // No connection exists
  | 'pending_sent'   // Current user sent a request (awaiting target's response)
  | 'pending_received' // Target user sent a request (awaiting current user's response)
  | 'connected';     // Connection is accepted

/** Response from GET /connections/status/:userId */
export interface ConnectionStatusResponse {
  status: ConnectionStatus;
  connectionId?: string; // Present when status is not 'none'
}

/** Minimal user data returned in connection lists */
export interface ConnectionUser {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  prime: boolean;
  roles: {
    User?: number;
    Editor?: number;
    Admin?: number;
  };
  business?: {
    industry?: string;
  };
}
