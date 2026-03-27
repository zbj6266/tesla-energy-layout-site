import React from "react";
import DevicePanel from "./components/DevicePanel";
import StatsBar from "./components/StatsBar";
import SiteLayout from "./components/SiteLayout";
import { useSession } from "./hooks/useSession";
import "./App.css";

export default function App() {
  const session = useSession();

  return (
    <div className="app-root">
        <header className="app-header">
            <div className="header-inner">
                <div className="header-title">Tesla Energy Layout Site</div>
                {session.sessionName && (
                    <div className="header-session-name">
                        Session: <strong>{session.sessionName}</strong>
                    </div>
                )}
            </div>
        </header>

        <main className="app-main">
        <DevicePanel
            qty={session.qty}
            updateQty={session.updateQty}
            setQtyDirect={session.setQtyDirect}
            autoTransformers={session.autoTransformers}
            sessionName={session.sessionName}
            sessionId={session.sessionId}
            loadInput={session.loadInput}
            setSessionName={session.setSessionName}
            setLoadInput={session.setLoadInput}
            saveSession={session.saveSession}
            loadSessionById={session.loadSessionById}
            reset={session.reset}
            status={session.status}
            statusMsg={session.statusMsg}
        />

        <div className="right-panel">
          <StatsBar
            totalCost={session.totalCost}
            totalEnergy={session.totalEnergy}
            totalAreaSqFt={session.totalAreaSqFt}
            qty={session.qty}
            autoTransformers={session.autoTransformers}
          />
          <SiteLayout layoutUnits={session.layoutUnits} />
        </div>
      </main>
    </div>
  );
}
