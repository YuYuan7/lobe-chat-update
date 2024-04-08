import { ActionIcon, Icon } from '@lobehub/ui';
import { Upload } from 'antd';
import { useTheme } from 'antd-style';
import { LucideImage, LucideLoader2 } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';

import { useFileStore } from '@/store/file';
import { useGlobalStore } from '@/store/global';
import { modelProviderSelectors } from '@/store/global/selectors';
import { useSessionStore } from '@/store/session';
import { agentSelectors } from '@/store/session/selectors';

/*const FileUpload = memo(() => {
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const upload = useFileStore((s) => s.uploadFile);

  const model = useSessionStore(agentSelectors.currentAgentModel);
  const [canUpload, enabledFiles] = useGlobalStore((s) => [
    modelProviderSelectors.modelEnabledUpload(model)(s),
    modelProviderSelectors.modelEnabledFiles(model)(s),
  ]);

  return (
    <Upload
      accept={enabledFiles ? undefined : 'image/*'}
      beforeUpload={async (file) => {
        setLoading(true);

        await upload(file);

        setLoading(false);
        return false;
      }}
      disabled={!canUpload}
      multiple={true}
      showUploadList={false}
    >
      {loading ? (
        <Center height={36} width={36}>
          <Icon
            color={theme.colorTextSecondary}
            icon={LucideLoader2}
            size={{ fontSize: 18 }}
            spin
          ></Icon>
        </Center>
      ) : (
        <ActionIcon
          disable={!canUpload}
          icon={LucideImage}
          placement={'bottom'}
          title={t(canUpload ? 'upload.actionTooltip' : 'upload.disabled')}
        />
      )}
    </Upload>
  );
});*/


const FileUpload = memo(() => {
  // ... 其他代码保持不变
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const upload = useFileStore((s) => s.uploadFile);

  const model = useSessionStore(agentSelectors.currentAgentModel);
  const [canUpload, enabledFiles] = useGlobalStore((s) => [
    modelProviderSelectors.modelEnabledUpload(model)(s),
    modelProviderSelectors.modelEnabledFiles(model)(s),
  ]);


  const [uploadedFiles, setUploadedFiles] = useState([]);

  // 修改 beforeUpload 函数以保存上传的文件信息
  const handleBeforeUpload = async (file: File) => {
    setLoading(true);
  
    await upload(file); // 使用明确的 File 类型
  
    // 将文件添加到回显列表
    setUploadedFiles((prevFiles) => [...prevFiles, file]);
  
    setLoading(false);
    return false; // 阻止 Upload 组件默认的上传行为
  };

  return (
    <div>
      <Upload
        beforeUpload={handleBeforeUpload}
        disabled={!canUpload}
        multiple={true}
        showUploadList={false}
      >
        {loading ? (
        <Center height={36} width={36}>
          <Icon
            color={theme.colorTextSecondary}
            icon={LucideLoader2}
            size={{ fontSize: 18 }}
            spin
          ></Icon>
        </Center>
      ) : (
        <ActionIcon
          disable={!canUpload}
          icon={LucideImage}
          placement={'bottom'}
          title={t(canUpload ? 'upload.actionTooltip' : 'upload.disabled')}
        />
      )}
      </Upload>
      <div>
        {uploadedFiles.map((file, index) => (
          <div key={index}>
            {file.type.startsWith('image/') ? (
              // 如果是图片文件，使用 img 元素显示
              <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100px' }} />
            ) : (
              // 如果是其他类型的文件，显示文件名称或图标
              <div>
                <Icon icon={LucideFile} /> {file.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default FileUpload;
