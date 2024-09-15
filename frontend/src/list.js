import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Button, TextField } from "@mui/material";
import { styled } from "styled-components";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_ITEM_MUTATION, GET_TODO_LIST } from "./queries";
import { Delete, Edit } from "@mui/icons-material";
import { useState } from "react";
import { getOperationName } from "@apollo/client/utilities";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const ContainerTop = styled.form`
  display: flex;
  background-color: #ffffff;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  gap: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const ContainerList = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  gap: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const ContainerListItem = styled.div`
  background-color: #f1f5f9;
  padding: 15px;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

const ContainerButton = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  button {
    padding: 10px 20px;
    border-radius: 8px;
    background-color: #3b82f6;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #2563eb;
    }
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 24px;
  color: #111827;
  margin-bottom: 15px;
`;

export default function CheckboxList() {
  const [item, setItem] = useState("");
  const { data } = useQuery(GET_TODO_LIST);

  const [addItem] = useMutation(ADD_ITEM_MUTATION);

  const onSubmit = async (event) => {
    event.preventDefault();
    await addItem({
      variables: {
        values: {
          name: item,
        },
      },
      awaitRefetchQueries: true,
      refetchQueries: [getOperationName(GET_TODO_LIST)],
    });
    setItem("");
  };

  const onDelete = async (event) => {
    console.log(onDelete);
    // Aqui você irá implementar a chamada para o backend de remoção de item
  };

  const onUpdate = async (event) => {
    console.log(onUpdate);
    // Aqui você irá implementar a chamada para o backend de edição de item
  };

  const onFilter = async (event) => {
    console.log(onFilter);
    // Aqui você irá implementar a chamada para o backend para fazer o filtro
  };

  return (
    <Container>
      <ContainerList>
        <Title>TODO LIST</Title>
        <ContainerTop onSubmit={onSubmit}>
          <TextField
            id="item"
            label="Digite aqui"
            value={item}
            type="text"
            variant="standard"
            onChange={(e) => setItem(e?.target?.value)}
          />
          <ContainerButton>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              color="info"
              onClick={onFilter}
            >
              Filtrar
            </Button>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              color="success"
              type="submit"
            >
              Salvar
            </Button>
          </ContainerButton>
        </ContainerTop>
        <List sx={{ width: "100%" }}>
          <ContainerListItem>
            {data?.todoList?.map((value, index) => {
              return (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    borderRadius: "5px",
                    marginTop: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <ListItemButton dense>
                    <ListItemText id={index} primary={value?.name} />
                    <Edit onClick={onUpdate} />
                    <Delete onClick={onDelete} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </ContainerListItem>
        </List>
      </ContainerList>
    </Container>
  );
}
