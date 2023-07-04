import { Avatar, Space, Upload, UploadProps } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import LineThreeDots from "components/common/LineThreeDots/LineThreeDots";
import { BsFileEarmarkFill } from "react-icons/bs";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { IUploadFileModel } from "services/types/common";
import { IFileStoreModel } from "services/types/file-store";
import styles from './MessageBoxFileStore.module.scss';
import { apiFileStore } from "services/apiAction/apiFileStore";


interface Props {
  files: IUploadFileModel<IFileStoreModel>[];
  onPreview?: ((file: UploadFile<any>) => void);
  onRemove?: (uid: string) => void;
  defaultFileList?: IUploadFileModel<IFileStoreModel>[];
  setDefaultFileList?: any;
}

const MessageBoxFileStore: React.FC<Props> = ({
  files,
  onRemove,
  defaultFileList,
  setDefaultFileList,
}) => {
  const handleRemove = (uid: string) => {
    onRemove && onRemove(uid);
  }

  const uploadImage = async options => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    fmData.append("files", file);
    try {
      const res = await apiFileStore.upload(fmData, config);
      onSuccess(res.data.data);
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // console.log(newFileList);
    // const arrayCheckKey = newFileList.filter(item => item.hasOwnProperty('response'))
    setDefaultFileList(newFileList);
  };

  return (
    <div className={`${styles[`message-box-file`]}`}>

      <div className={`${styles[`message-box-file__container`]}`}>

        <Upload className={`${styles[`message-box-file__upload`]}`}
          multiple={true}
          showUploadList={false}
          customRequest={uploadImage}
          onChange={handleChange}
          fileList={defaultFileList}
        >
          <FiUpload size={20} />
        </Upload>

        {files?.map((item) =>
          item?.type.includes("image") ?
            (
              <div key={item.uid} className={`${styles[`message-box-file__image`]}`}
                style={{ backgroundImage: `url("${item.response?.link}")` }}
              >
                <div className={`${styles[`message-box-file__remove-btn`]}`} onClick={() => handleRemove(item.uid)}>
                  <IoCloseCircleSharp className={`${styles[`icon`]}`} size={20}></IoCloseCircleSharp>
                </div>
              </div>
            )
            :
            (
              <div key={item.uid} className={`${styles[`message-box-file__file`]}`}>
                <div className={`${styles[`message-box-file__file-icon`]}`}>
                  <BsFileEarmarkFill size={20} />
                </div>
                <div className={`${styles[`message-box-file__file-name`]}`}>
                  <LineThreeDots className={`${styles["message-box-file__file-name-text"]}`} numberLine={2}>
                    {item.response?.name}
                  </LineThreeDots>
                </div>
                <div className={`${styles[`message-box-file__remove-btn`]}`} onClick={() => handleRemove(item.uid)}>
                  <IoCloseCircleSharp className={`${styles[`icon`]}`} size={20}></IoCloseCircleSharp>
                </div>
              </div>
            )


        )}
      </div>
    </div >
  );
}

export default MessageBoxFileStore;