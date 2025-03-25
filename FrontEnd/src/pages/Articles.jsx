import { ArticlesList } from "../components/ArticlesList";
import { Layout } from "../components/Layout";

const Articles = ({ token }) => {
  

  return (
  <Layout>
    <div>
      <h1>Artículos de Psicología</h1>
      
      <ArticlesList token={token} />
    </div>
  </Layout>
  );
};

export { Articles };
