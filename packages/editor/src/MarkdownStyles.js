const MarkdownStyles = theme => ({
 editorFrame: {
    borderColor: theme.palette.primary.main,
    borderWidth: "1px",
    borderStyle: "solid",
  },
  button: {
    margin: theme.spacing(1),
  },
  headerOne: {
    fontWeight: "600",
    marginBottom: theme.spacing(2),
    fontSize: "1.4rem",
    '@media (min-width:480px)': {
      fontSize: '1.8rem',
    },
  },
  headerTwo: {
    fontWeight: "600",
    marginBottom: theme.spacing(2),
    fontSize: "1.3rem",
    '@media (min-width:480px)': {
      fontSize: '1.6rem',
    },
  },
  headerThree: {
    fontWeight: "600",
    marginBottom: theme.spacing(2),
    fontSize: "1.2rem",
    '@media (min-width:480px)': {
      fontSize: '1.4rem',
    },
  },
  blockquote: {
    fontFamily: "'Roboto', sans-serif",
    padding: theme.spacing(1),
    background: "#dddddd",
    fontSize: "0.95rem",
    '@media (min-width:480px)': {
      fontSize: '1.05rem',
    },
    lineHeight: "2.0em",
  },
  unorderedListItem: {
  },
  orderedListItem: {
  },
  codeBlock: {
    background: "#EFF0F1", // matching github
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontFamily:"Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
    fontSize: "0.65rem",
  },
  unstyled: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "0.95rem",
    '@media (min-width:480px)': {
      fontSize: '1.05rem',
    },
    lineHeight: "2.0em",
    marginBottom: "1.5em",
  }
});

export const blockStyleFn = (classes, contentBlock) => {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return classes.blockquote;
  } else if (type === 'unordered-list-item') {
    return classes.unorderedListItem;
  } else if (type === 'ordered-list-item') {
    return classes.orderedListItem;
  } else if (type === 'code-block') {
    return classes.codeBlock;
  } else if (type === 'unstyled') {
    return classes.unstyled;
  }
}

export default MarkdownStyles;
