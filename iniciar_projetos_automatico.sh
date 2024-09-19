#!/bin/bash

# Iniciar uma nova sessão tmux
tmux new-session -d -s frontendserverless

# Dividir a janela verticalmente em dois painéis
tmux split-window -v

# Executar npm start em cada painel, nas pastas correspondentes
tmux send-keys -t frontendserverless:0.0 "cd frontend && npm start" C-m
tmux send-keys -t frontendserverless:0.1 "cd serverless && npm start" C-m

# Focar no primeiro painel
tmux select-pane -t frontendserverless:0.0

# Anexar à sessão tmux
tmux attach-session -t frontendserverless
