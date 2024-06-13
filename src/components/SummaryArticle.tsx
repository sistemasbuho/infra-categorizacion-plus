import style from  '../assets/css/components/keywordSearch.module.css'

function SummaryArticle({ text }) {
  return <div className={style.container}>{text}</div>;
}

export default SummaryArticle;
