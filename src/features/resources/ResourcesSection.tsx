'use client';

import { Typography } from '@mui/material';
import { useResources } from './hooks/useResources';
import ResourceTabs from './components/ResourceTabs';
import ResourceGrid from './components/ResourceGrid';
import ResourceSkeletonGrid from './components/ResourceSkeletonGrid';
import CreateResourceDialog from './components/CreateResourceDialog';

export default function ResourcesSection() {
  const rs = useResources();

  const title = '資源分享';
  const createLabel = rs.activeTab === 0 ? '新增分享' : '新增需求';
  const cardActionLabel = rs.activeTab === 0 ? '查看資源' : '聯繫需求';

  //  Loading 首屏
  if (rs.loading && rs.items.length === 0) {
    return (
      <>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2, color: 'primary' }}
        >
          {title}
        </Typography>

        <ResourceTabs
          activeTab={rs.activeTab}
          setActiveTab={rs.setActiveTab}
          onCreate={rs.handleCreateClick}
          createDisabled={rs.status === 'loading'}
          createLabel={createLabel}
        />

        {rs.error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {rs.error}
          </Typography>
        )}

        <ResourceSkeletonGrid />
      </>
    );
  }

  //  空狀態
  if (!rs.loading && rs.items.length === 0) {
    return (
      <>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2, color: 'primary' }}
        >
          {title}
        </Typography>

        <ResourceTabs
          activeTab={rs.activeTab}
          setActiveTab={rs.setActiveTab}
          onCreate={rs.handleCreateClick}
          createDisabled={rs.status === 'loading'}
          createLabel={createLabel}
        />

        {rs.error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {rs.error}
          </Typography>
        )}

        <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          目前沒有資料
        </Typography>
      </>
    );
  }

  // 一般清單
  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 2, color: 'primary' }}
      >
        {title}
      </Typography>

      <ResourceTabs
        activeTab={rs.activeTab}
        setActiveTab={rs.setActiveTab}
        onCreate={rs.handleCreateClick}
        createDisabled={rs.status === 'loading'}
        createLabel={createLabel}
      />

      {rs.error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {rs.error}
        </Typography>
      )}

      <ResourceGrid
        items={rs.items}
        actionLabel={cardActionLabel}
        onLoadMore={() => rs.fetchPostsPage()}
        hasMore={rs.hasMore}
        loading={rs.loading}
        showLoadMore={rs.showLoadMore}
      />

      <CreateResourceDialog
        open={rs.open}
        onClose={() => rs.setOpen(false)}
        form={rs.form}
        setForm={rs.setForm}
        showErrors={rs.showErrors}
        fieldErrors={rs.fieldErrors}
        creating={rs.creating}
        isSubmitDisabled={rs.isSubmitDisabled}
        onSubmit={async () => {
          try {
            rs.setError(null);
            await rs.createItem();
          } catch (e: unknown) {
            const msg =
              e instanceof Error && e.message ? e.message : '建立失敗';
            rs.setError(msg);
            console.error('createItem failed:', e);
          }
        }}
        title={createLabel}
        uploading={rs.uploading}
        uploadErr={rs.uploadErr}
        handleFileChange={rs.handleFileChange}
      />
    </>
  );
}
