import FilesTablePage from "../components/FilesTablePage";
import { getFilesPaged } from "../services/fileService";

const RejectedFilesPage = () => (
  <FilesTablePage
    title="Rad etilgan hujjatlar"
    subtitle="Rad etilgan hujjatlar ro'yxati"
    emptyTitle="Rad etilgan hujjatlar yo'q"
    fetcher={(page, limit, search) =>
      getFilesPaged("Tasdiqlanmadi", page, limit, search)
    }
  />
);

export default RejectedFilesPage;
