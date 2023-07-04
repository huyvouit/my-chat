import { Dropdown, Form, FormInstance, MenuProps, Upload, UploadProps } from "antd";
import React, { useState } from "react";
import styles from './MessageBoxMedia.module.scss';
import { GrAttachment } from "react-icons/gr";
import { IoMdImage } from "react-icons/io";
import { apiFileStore } from "services/apiAction/apiFileStore";
import { IFileStoreModel } from "services/types/file-store";
import { IUploadFileModel } from "services/types/common";
import de from "date-fns/esm/locale/de/index.js";

interface Props {
  form: FormInstance<any>;
  defaultFileList?: IUploadFileModel<IFileStoreModel>[];
  setDefaultFileList?: any;
  setSubmitFiles?: any;
}

const MessageBoxMedia = React.forwardRef<any, Props>(({
  form,
  defaultFileList,
  setDefaultFileList,
  setSubmitFiles
}, ref) => {
  const [progress, setProgress] = useState(0);

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
    setDefaultFileList(newFileList);
    setSubmitFiles(false)
  };

  const messageAction: MenuProps['items'] = [
    {
      key: '1',
      icon: <IoMdImage size={16} />,
      label: (
        <Form.Item name="attachFile" noStyle>
          <Upload className={`${styles[`message-box-input__btn`]}`}
            multiple={true}
            showUploadList={false}
            customRequest={uploadImage}
            onChange={handleChange}
            fileList={defaultFileList}
          >
            Photos/Files
          </Upload>
        </Form.Item>
      ),
    },
  ];

  return (
    <div className={`${styles[`message-box-media`]}`}>
      <div className={`${styles[`message-box-media__container`]}`}>
        <Dropdown
          menu={{ items: messageAction }}
          placement="topRight"
          arrow={{ pointAtCenter: true }}
          autoFocus={false}
          overlayStyle={{ width: 150 }}
          trigger={["click"]}
        >
          <GrAttachment size={16} />
        </Dropdown>
      </div>
    </div>
  );
});

export default React.memo(MessageBoxMedia);