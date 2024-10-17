import { Fetch, Method } from "./fetch";
import type { User, Workspace, Board, List, Card, Notification } from "@/types";

export class Trello {
  static attempt(token: string): Promise<User> {
    Fetch.setToken(token);
    return Trello.me();
  }

  static me(): Promise<User> {
    return Fetch.call("/members/me");
  }

  static user(id: string): Promise<User> {
    return Fetch.call(`/members/${id}`);
  }

  static myCards(id: string): Promise<Card[]> {
    return Fetch.call(`/members/${id}/cards`);
  }

  static myBoards(id: string): Promise<Board[]> {
    return Fetch.call(`/members/${id}/boards`);
  }

  static myNotifications(id: string): Promise<Notification[]> {
    return Fetch.call(`/members/${id}/notifcations`);
  }

  static workspaces(): Promise<Workspace[]> {
    return Fetch.call("/members/me/organizations");
  }

  static workspaceMembers(id: string): Promise<User[]> {
    return Fetch.call(`/organizations/${id}/members`);
  }

  static createWorkspace(workspace: Record<string, any>): Promise<Workspace> {
    return Fetch.call(`/organizations`, Method.POST, workspace);
  }

  static deleteWorkspace(id: string): Promise<Workspace> {
    return Fetch.call(`/organizations/${id}`, Method.DELETE);
  }

  static updateWorkspace(
    id: string,
    workspace: Record<string, any>
  ): Promise<Workspace> {
    return Fetch.call(`/organizations/${id}`, Method.PUT, workspace);
  }

  static boards(id: string): Promise<Board[]> {
    return Fetch.call(`/organizations/${id}/boards`);
  }

  static createBoard(board : Record<string,any>): Promise<Board> {
    return Fetch.call(`/boards/`, Method.POST, board);
}

  static board(id: string): Promise<Board> {
    return Fetch.call(`/boards/${id}`);
  }

  

  static deleteBoard(id: string): Promise<Board> {
    return Fetch.call(`/boards/${id}`, Method.DELETE);
  }

  static updateBoard(id: string, boardName: string): Promise<Board> {
    return Fetch.call(`/boards/${id}`, Method.PUT, { name : boardName});
  }

  static lists(id: string): Promise<List[]> {
    return Fetch.call(`/boards/${id}/lists`);
  }

  static createList(id: string, name: string): Promise<List> {
    return Fetch.call(`/boards/${id}/lists`, Method.POST, { name });
  }

  static deleteList(id: string): Promise<List> {
    return Fetch.call(`/lists/${id}/closed`, Method.PUT, { value: "true" });
  }

  static updateList(id: string, name: string): Promise<List> {
    return Fetch.call(`/lists/${id}`, Method.PUT, { name });
  }

  static cards(id: string): Promise<Card[]> {
    return Fetch.call(`/lists/${id}/cards`);
  }

  static createCard(id: string, card: Record<string, any>): Promise<Card> {
    return Fetch.call(`/lists/${id}/cards`, Method.POST, card);
  }

  static deleteCard(id: string): Promise<Card> {
    return Fetch.call(`/cards/${id}`, Method.DELETE);
  }

  static updateCard(id: string, card: Record<string, any>): Promise<Card> {
    return Fetch.call(`/cards/${id}`, Method.PUT, card);
  }

  static batch<T>(urls: string[]): Promise<T> {
    return Fetch.call("/batch", Method.GET, {
      urls: urls.join(","),
    });
  }
}
