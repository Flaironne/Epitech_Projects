import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { Trello } from "@/api";
import { Board as BoardType } from "@/types";

import { Board } from "./Board";
import { DeleteModal } from "./Modal/DeleteModal";
import { UpdateModal } from "./Modal/UpdateBoardModal";
import { Spinner } from "./Spinner";

interface BoardProps {
  workspacesId: string;
  routing : boolean;
}

export const Boards: React.FC<BoardProps> = (props) => {
  const { workspacesId , routing=true } = props;

  const [boards, setBoards] = useState<BoardType[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  
  
  const [board, setBoard] = useState<BoardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [boardName, setBoardName] = useState<string>("");
  const [boardId, setBoardId] = useState<string>("");

  const triggerUpdateModal = (name: string, id: string) => {
    setShowUpdateModal(true);
    setBoardName(name);
    setBoardId(id);
  };

  const cancelUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const getWorkspaceBoards = () => {
    Trello.boards(workspacesId).then((res) => {
      setBoards(res);
      setLoading(false);
    });
  };

  const deleteBoard = () => {
    if (!board) return;
    setLoading(true);

    Trello.deleteBoard(board.id).then(() => {
      getWorkspaceBoards();
      setShowDeleteModal(false);
    });

    setShowDeleteModal(false);
  };

  useEffect(() => {
    getWorkspaceBoards();
  }, []);

  return (
    <View>
      {loading ? (
        <Spinner size={30} />
      ) : (
        boards.map((board, boardIndex) => (
          <View key={boardIndex} style={{ margin: 8 }} id={`board-${boardIndex}`}>
            <Board
              board={board}
              onLongPress={() => {
                setBoard(board);
                setShowDeleteModal(true);
              }}
              routing={routing}
              onPress={() => triggerUpdateModal(board.name, board.id)}
            />
          </View>
        ))
      )}

      {board && (
        <DeleteModal
          title={board.name}
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={deleteBoard}
        />
      )}

      {showUpdateModal && (
        <UpdateModal
          visible={showUpdateModal}
          onCancel={cancelUpdateModal}
          initialName={boardName}
          boardId={boardId}
          onRefresh={getWorkspaceBoards}
        />
      )
        }
    </View>
  );
};
