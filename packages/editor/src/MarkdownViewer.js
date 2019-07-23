import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Editor, EditorState, convertFromRaw } from 'draft-js';
import {stateFromMarkdown} from 'draft-js-import-markdown';
import MarkdownDecorator from './MarkdownDecorator';
import MarkdownStyles, { blockStyleFn } from './MarkdownStyles';

const useStyles = makeStyles(MarkdownStyles);
const decorator = MarkdownDecorator();

function MarkdownViewer(props) {
  const classes = useStyles();
  const { resource } = props;
  const contentState = resource.raw ? convertFromRaw(resource.raw) : stateFromMarkdown(resource.markdown);
  const editorState = EditorState.createWithContent(contentState, decorator);
  return (
    <Editor readOnly={true} 
      blockStyleFn={(contentBlock) => { return blockStyleFn(classes, contentBlock)}}
      editorState={editorState} />
  )  
}

MarkdownViewer.propTypes = {
  resource: PropTypes.object.isRequired,
};

export default MarkdownViewer;
