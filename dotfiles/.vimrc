" Basic settings
set nocompatible
set encoding=utf-8
set fileencoding=utf-8

" Enable syntax highlighting
syntax on
filetype plugin indent on

" Display settings
set number
set relativenumber
set ruler
set showcmd
set showmode
set wildmenu
set wildmode=longest:full,full
set laststatus=2

" Search settings
set incsearch
set hlsearch
set ignorecase
set smartcase

" Indentation settings
set autoindent
set smartindent
set tabstop=4
set shiftwidth=4
set expandtab
set smarttab

" File handling
set autoread
set hidden
set backup
set backupdir=~/.vim/backup//
set directory=~/.vim/swap//
set undofile
set undodir=~/.vim/undo//

" Create directories if they don't exist
if !isdirectory($HOME."/.vim/backup")
    call mkdir($HOME."/.vim/backup", "p", 0700)
endif
if !isdirectory($HOME."/.vim/swap")
    call mkdir($HOME."/.vim/swap", "p", 0700)
endif
if !isdirectory($HOME."/.vim/undo")
    call mkdir($HOME."/.vim/undo", "p", 0700)
endif

" UI enhancements
set cursorline
set scrolloff=5
set sidescrolloff=5
set mouse=a

" Performance
set lazyredraw
set ttyfast

" Key mappings
let mapleader = ","

" Quick save
nnoremap <leader>w :w<CR>

" Quick quit
nnoremap <leader>q :q<CR>

" Clear search highlighting
nnoremap <leader><space> :nohlsearch<CR>

" Split navigation
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" Buffer navigation
nnoremap <leader>bn :bnext<CR>
nnoremap <leader>bp :bprevious<CR>
nnoremap <leader>bd :bdelete<CR>

" Toggle line numbers
nnoremap <leader>n :set number!<CR>

" Enable folding
set foldmethod=indent
set foldlevel=99

" Color scheme
if has("termguicolors")
    set termguicolors
endif

" Status line
set statusline=%F%m%r%h%w\ [%{&ff}]\ [%Y]\ [%04l,%04v][%p%%]\ [%L\ lines]

" Auto-remove trailing whitespace
autocmd BufWritePre * :%s/\s\+$//e
