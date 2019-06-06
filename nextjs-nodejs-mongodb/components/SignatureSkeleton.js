// Signature Skeleton Component
// ----
// This file holds the functional component for the signature skeleton in the guestbook.
// This component shows a skeleton of the Signature component before data loads.

function SignatureSkeleton({ ...props }) {
  return (
    <div className="signature" {...props}>
      <div className="avatar"></div>
      <div className="signature-content">
        <div className="signature-header"></div>
        <div className="signature-body"></div>
      </div>

      <style jsx>{`
        .signature {
          border-radius: 5px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 6px 12px;
          display: grid;
          grid-template-columns: 96px 1fr;
          margin-bottom: 24px;
        }

        .avatar {
          width: 64px;
          height: 64px;
          margin: 16px;
          border-radius: 5px;
          overflow: hidden;
          background: #E1E1E1;
        }

        .signature-content {
          box-sizing: border-box;
          color: #333;
          display: flex;
          flex-direction: column;
          padding: 16px;
        }

        .signature-header {
          display: flex;
          height: fit-content;
          justify-content: space-between;
          width: 100px;
          height: 24px;
          max-width: 100%;
          background: #E1E1E1;
          margin-bottom: 16px;
        }

        .signature-body {
          background: #E1E1E1;
          max-width: 100%;
          width: 250px;
          height: 18px;
        }
      `}</style>
    </div>
  )
}

export default SignatureSkeleton