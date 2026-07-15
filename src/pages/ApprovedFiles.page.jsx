import FilesTablePage from "../components/FilesTablePage";
import { getFilesPaged } from "../services/fileService";

const ApprovedFilesPage = () => (
  <FilesTablePage
    title="Tasdiqlangan hujjatlar"
    subtitle="Tasdiqlangan hujjatlar ro'yxati"
    emptyTitle="Tasdiqlangan hujjatlar yo'q"
    fetcher={(page, limit, search) =>
      getFilesPaged("Tasdiqlandi", page, limit, search)
    }
  />
);

export default ApprovedFilesPage;
