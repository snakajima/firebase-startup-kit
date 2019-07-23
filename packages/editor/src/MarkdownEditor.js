import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
//import theme from '../theme';
import { IconButton, Grid } from '@material-ui/core';
import TrashIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import LinkIcon from '@material-ui/icons/Link';
import { FormatBold, FormatItalic, FormatUnderlined, FormatQuote, MoreHoriz } from '@material-ui/icons';
import { Code } from '@material-ui/icons';
import { FormatListBulleted, FormatListNumbered, Undo, Redo } from '@material-ui/icons';
import { Editor, RichUtils, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import MarkdownDecorator from './MarkdownDecorator';
import MarkdownStyles, { blockStyleFn } from './MarkdownStyles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { stateToMarkdown } from 'draft-js-export-markdown';
import { stateFromMarkdown } from 'draft-js-import-markdown';
//import stateFromMarkdown from './markdown/stateFromMarkdown';
//import stateToMarkdown from './markdown/stateToMarkdown';

const styles = MarkdownStyles;
const decorator = MarkdownDecorator();

const useStyles = makeStyles(styles);

function MarkdownEditor(props) {
  const classes = useStyles();
  const { resource } = props;
  function initialEditorState() {
    const contentState = resource.raw ? convertFromRaw(resource.raw) : stateFromMarkdown(resource.markdown || "");
    return EditorState.createWithContent(contentState, decorator);
  }
  const [editorState, setEditorState] = useState(initialEditorState());
  const [anchorEl, setAnchorEl] = useState(null);

  const onChange = (state) => {
    setEditorState(state);
  }

  const onSave = (e) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const markdown = stateToMarkdown(contentState);
    const raw = convertToRaw(contentState);
    console.log(raw);
    props.onSave(markdown, raw);
  }

  const onCancel = (e) => {
    props.onCancel();
  }

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  const handleReturn = (e, state) => {
    if (e.shiftKey) {
      const newState = RichUtils.insertSoftNewline(state);
      if (newState) {
        onChange(newState);
        return 'handled';
      }
    }
    return 'not-handled';
  }

  const toggleStyle = (style) => {
    onChange(RichUtils.toggleInlineStyle(editorState, style));    
  }
  const toggleBlockType = (type) => {
    onChange(RichUtils.toggleBlockType(editorState, type));
    setAnchorEl(null);
  }
  const onMouseDown = e => {
    e.preventDefault(); // don't steal focus
  }
  const undo = () => {
    onChange(EditorState.undo(editorState));
  }
  const redo = () => {
    onChange(EditorState.redo(editorState));
  }
  function handleMore(e) {
    console.log("handleMore", e);
    setAnchorEl(e.currentTarget);
  }
  function closeMore() {
    setAnchorEl();
  }
  // https://bitwiser.in/2017/05/11/creating-rte-part-3-entities-and-decorators.html
  const editLink = () => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      console.log("selection is collapsed")
      return;
    }

    let url = ''; // default
    const content = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const blockWithLinkAtBeginning = content.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    if (linkKey) {
      const linkInstance = content.getEntity(linkKey);
      url = linkInstance.getData().url;
    }

    let link = window.prompt("Paste the link", url);
    if (link === null) {
      console.log("cancelled");
      return;
    }
    if (!link) {
      console.log("removing link");
      const newEditorState = RichUtils.toggleLink(editorState, selection, null);
      setEditorState(newEditorState);
      return;
    }
    console.log("adding a link", link);
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url: link });
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    //const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
    //const yetNewEditorState = RichUtils.toggleLink(newEditorState, selection, entityKey);
    const newEditorState = EditorState.set(editorState, { currentContent: contentWithEntity });
    const yetNewEditorState = RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);

    setEditorState(yetNewEditorState);
  }

  const { onDelete } = props;
  const canUndo = editorState.getUndoStack().size !== 0;
  const canRedo = editorState.getRedoStack().size !== 0;
  return (
    <div>
      <Grid container>
        <Grid item>
          <IconButton size="small" disabled={!canUndo} onClick={undo} onMouseDown={onMouseDown}>
            <Undo/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" disabled={!canRedo} onClick={redo} onMouseDown={onMouseDown}>
            <Redo/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={()=>{toggleStyle("BOLD")}} onMouseDown={onMouseDown}>
            <FormatBold/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={()=>{toggleStyle("ITALIC")}} onMouseDown={onMouseDown}>
            <FormatItalic/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={()=>{toggleStyle("UNDERLINE")}} onMouseDown={onMouseDown}>
            <FormatUnderlined/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={()=>{toggleBlockType("unordered-list-item")}} onMouseDown={onMouseDown}>
            <FormatListBulleted/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={()=>{toggleBlockType("ordered-list-item")}} onMouseDown={onMouseDown}>
            <FormatListNumbered/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={editLink} onMouseDown={onMouseDown}>
            <LinkIcon/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={handleMore} onMouseDown={onMouseDown}>
            <MoreHoriz/>
          </IconButton>
        </Grid>
        <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMore}>
          <MenuItem onClick={()=>{toggleBlockType("code-block")}}><Code/></MenuItem>
          <MenuItem onClick={()=>{toggleBlockType("blockquote")}}><FormatQuote/></MenuItem>
          <MenuItem onClick={()=>{toggleBlockType("header-one")}}>H1</MenuItem>
          <MenuItem onClick={()=>{toggleBlockType("header-two")}}>H2</MenuItem>
          <MenuItem onClick={()=>{toggleBlockType("header-three")}}>H3</MenuItem>
        </Menu>
      </Grid>
      <Grid container>
        <Grid item xs={11} className={classes.editorFrame}>
          <Editor editorState={editorState} 
            blockStyleFn={(contentBlock) => { return blockStyleFn(classes, contentBlock)}}
            handleReturn={handleReturn}
            handleKeyCommand={handleKeyCommand}
            onChange={onChange} />
        </Grid>
        <Grid item xs={1}>
          <IconButton size="small" onClick={onSave} type="submit">
            <SaveIcon />
          </IconButton>
          <br/>
          <IconButton size="small" onClick={onCancel}>
            <CancelIcon />
          </IconButton>
          <br/>
          {
          onDelete && <IconButton size="small" onClick={onDelete}>
            <TrashIcon />
          </IconButton>
          }
        </Grid>
      </Grid>
    </div>
  );
}

MarkdownEditor.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    resource: PropTypes.object.isRequired,
  };
  
export default MarkdownEditor;