import FilesTablePage from "../components/FilesTablePage";
import { getNewFilesPaged } from "../services/fileService";

const NewAchievementsPage = () => (
  <FilesTablePage
    title="Yangi hujjatlar"
    subtitle="Tekshirish uchun kutilayotgan hujjatlar"
    emptyTitle="Yangi hujjatlar yo'q"
    fetcher={(page, limit, search) => getNewFilesPaged(page, limit, search)}
  />
);

export default NewAchievementsPage;
