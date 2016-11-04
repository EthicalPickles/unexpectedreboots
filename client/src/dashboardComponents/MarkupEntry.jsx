var MarkupEntry = ({markup}) => {
  return (
    <div>
      <div className="author-label">{markup.author} -- {markup.createdat.slice(0, -8).split('T').join(' at ')}</div>
      <a target="_blank" href={markup.url}>
        <div>{markup.title}</div>
      </a>
    </div>
  );

};


window.MarkupEntry = MarkupEntry;
