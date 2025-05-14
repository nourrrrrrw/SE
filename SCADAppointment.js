import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const SCADAppointment = () => {
  const navigate = useNavigate();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('career');
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [activeCall, setActiveCall] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [simulateRemote, setSimulateRemote] = useState(false);
  // Notification state
  const [showAcceptedNotification, setShowAcceptedNotification] = useState(false);
  const [acceptedAppointment, setAcceptedAppointment] = useState(null);

  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // WebRTC configuration (using Google's public STUN servers)
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Dummy data for appointments
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      type: 'Career Guidance',
      date: '2024-03-20',
      time: '10:00',
      status: 'pending',
      notes: 'Need guidance on career path in software engineering',
      isOnline: true,
      hasIncomingCall: false
    },
    {
      id: 2,
      type: 'Report Clarification',
      date: '2024-03-22',
      time: '14:30',
      status: 'accepted',
      notes: 'Clarification needed on internship report feedback',
      isOnline: false,
      hasIncomingCall: true
    },
    {
      id: 3,
      type: 'Career Guidance',
      date: '2024-03-25',
      time: '11:00',
      status: 'rejected',
      notes: 'Discussion about potential internship opportunities',
      isOnline: true,
      hasIncomingCall: false
    }
  ]);

  // Simulate incoming call notification
  useEffect(() => {
    const checkIncomingCalls = () => {
      const incomingCallAppointment = appointments.find(app => app.hasIncomingCall);
      if (incomingCallAppointment && !activeCall) {
        setIncomingCall(incomingCallAppointment);
        setShowIncomingCall(true);
      }
    };

    const interval = setInterval(checkIncomingCalls, 5000);
    return () => clearInterval(interval);
  }, [appointments, activeCall]);

  // Initialize media stream when video is enabled
  useEffect(() => {
    if (isVideoEnabled && activeCall) {
      startLocalStream();
    } else if (localStream) {
      stopLocalStream();
    }
    return () => {
      if (localStream) {
        stopLocalStream();
      }
    };
  }, [isVideoEnabled, activeCall]);

  // Handle peer connection when call starts
  useEffect(() => {
    if (activeCall && isCallStarted) {
      initializePeerConnection();
    }
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [activeCall, isCallStarted]);

  // Simulate remote participant joining after 3 seconds
  useEffect(() => {
    if (activeCall && !remoteStream) {
      const timer = setTimeout(() => {
        setSimulateRemote(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setSimulateRemote(false);
    }
  }, [activeCall, remoteStream]);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera and microphone. Please check your permissions.');
    }
  };

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
  };

  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection(configuration);
    
    // Add local stream to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real application, you would send this to the other peer
        console.log('New ICE candidate:', event.candidate);
      }
    };

    // Handle incoming streams
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    setPeerConnection(pc);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: appointments.length + 1,
      type: requestType === 'career' ? 'Career Guidance' : 'Report Clarification',
      date: requestDate,
      time: requestTime,
      status: 'pending',
      notes: requestNotes,
      isOnline: false,
      hasIncomingCall: false
    };
    setAppointments([...appointments, newAppointment]);
    setShowRequestModal(false);
    // Reset form
    setRequestType('career');
    setRequestDate('');
    setRequestTime('');
    setRequestNotes('');
    // Timer: after 10 seconds, auto-accept the appointment and show notification
    setTimeout(() => {
      setAppointments(current => current.map(app =>
        app.id === newAppointment.id ? { ...app, status: 'accepted' } : app
      ));
      setAcceptedAppointment({ ...newAppointment, status: 'accepted' });
      setShowAcceptedNotification(true);
    }, 10000); // 10 seconds for demo
  };

  const handleAppointmentAction = (id, action) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: action } : app
    ));
    if (action === 'accepted') {
      const app = appointments.find(app => app.id === id);
      setAcceptedAppointment(app);
      setShowAcceptedNotification(true);
    }
  };

  const handleStartCall = async (appointment) => {
    setActiveCall(appointment);
    setShowIncomingCall(false);
    setIncomingCall(null);
    setIsCallStarted(true);
    await startLocalStream();
  };

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    stopLocalStream();
    setRemoteStream(null);
    setActiveCall(null);
    setIsVideoEnabled(true);
    setIsMuted(false);
    setIsScreenSharing(false);
    setIsCallStarted(false);
  };

  const handleAcceptCall = () => {
    if (incomingCall) {
      setActiveCall(incomingCall);
      setShowIncomingCall(false);
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    setShowIncomingCall(false);
    setIncomingCall(null);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        if (isVideoEnabled) {
          videoTrack.enabled = false;
        } else {
          // If the track is ended, reacquire
          if (videoTrack.readyState === 'ended' || !videoTrack.enabled) {
            const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const newTrack = newStream.getVideoTracks()[0];
            localStream.removeTrack(videoTrack);
            localStream.addTrack(newTrack);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStream;
            }
          } else {
            videoTrack.enabled = true;
          }
        }
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        // For demo, show screen in remote video
        setRemoteStream(screenStream);
        screenTrack.onended = () => {
          setIsScreenSharing(false);
          setRemoteStream(null);
        };
        setIsScreenSharing(true);
      } else {
        setIsScreenSharing(false);
        setRemoteStream(null);
      }
    } catch (error) {
      alert('Could not share screen.');
    }
  };

  return (
    <>
      <Navbar />
      {/* Timed notification for accepted appointment */}
      {showAcceptedNotification && acceptedAppointment && (
        <div style={{
          position: 'fixed',
          top: 30,
          right: 30,
          background: '#D1FAE5',
          color: '#065F46',
          borderRadius: 12,
          padding: '22px 32px',
          boxShadow: '0 4px 24px rgba(35,75,115,0.10)',
          zIndex: 2001,
          minWidth: 320,
          fontWeight: 600,
          fontSize: 17,
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          <span style={{ fontSize: 28, marginRight: 10 }}>✅</span>
          <span>
            Your appointment for <b>{acceptedAppointment.type}</b> on <b>{new Date(acceptedAppointment.date).toLocaleDateString()}</b> at <b>{acceptedAppointment.time}</b> has been <b>accepted</b> by the SCAD Officer!
          </span>
          <button onClick={() => setShowAcceptedNotification(false)} style={{ marginLeft: 18, background: 'none', border: 'none', color: '#065F46', fontWeight: 700, fontSize: 22, cursor: 'pointer' }}>×</button>
        </div>
      )}
      <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto', marginTop: '72px' }}>
        {/* Incoming Call Notification */}
        {showIncomingCall && incomingCall && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            zIndex: 1000,
            width: '300px'
          }}>
            <h3 style={{ color: '#234B73', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
              Incoming Call
            </h3>
            <p style={{ color: '#666', fontSize: '15px', marginBottom: '16px' }}>
              {incomingCall.type} appointment with SCAD
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAcceptCall}
                style={{
                  flex: 1,
                  background: '#234B73',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Accept
              </button>
              <button
                onClick={handleRejectCall}
                style={{
                  flex: 1,
                  background: '#FEE2E2',
                  color: '#991B1B',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Active Call Interface */}
        {activeCall && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
              {/* Remote Video or Placeholder */}
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    background: '#222'
                  }}
                />
              ) : simulateRemote ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #234B73 0%, #35708E 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: '#fff',
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: 1
                }}>
                  <div style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    fontSize: 60
                  }}>
                    👤
                  </div>
                  Other participant is online
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #234B73 0%, #35708E 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: '#fff',
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: 1
                }}>
                  <div style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    fontSize: 60
                  }}>
                    👤
                  </div>
                  Waiting for the other participant to join…
                </div>
              )}
              {/* Local Video */}
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '200px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
              {/* Call Info */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(0,0,0,0.5)',
                padding: '8px 16px',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '14px',
                backdropFilter: 'blur(4px)'
              }}>
                {activeCall.type} - {new Date(activeCall.date).toLocaleDateString()} {activeCall.time}
              </div>
            </div>
            {/* Call Controls (always visible at the bottom) */}
            <div style={{
              background: 'rgba(0,0,0,0.8)',
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              backdropFilter: 'blur(8px)'
            }}>
              <button
                onClick={toggleMute}
                style={{
                  background: isMuted ? '#FEE2E2' : 'rgba(255,255,255,0.1)',
                  color: isMuted ? '#991B1B' : '#fff',
                  border: 'none',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? '🔇' : '🎤'}
              </button>
              <button
                onClick={toggleVideo}
                style={{
                  background: isVideoEnabled ? 'rgba(255,255,255,0.1)' : '#FEE2E2',
                  color: isVideoEnabled ? '#fff' : '#991B1B',
                  border: 'none',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoEnabled ? '📹' : '🚫'}
              </button>
              <button
                onClick={toggleScreenShare}
                style={{
                  background: isScreenSharing ? '#D1FAE5' : 'rgba(255,255,255,0.1)',
                  color: isScreenSharing ? '#065F46' : '#fff',
                  border: 'none',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
              >
                {isScreenSharing ? '🖥️' : '💻'}
              </button>
              <button
                onClick={handleEndCall}
                style={{
                  background: '#FEE2E2',
                  color: '#991B1B',
                  border: 'none',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
                title="End call"
              >
                📞
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#234B73', fontSize: '32px', fontWeight: '700' }}>
            SCAD Appointments
          </h1>
          <button
            onClick={() => setShowRequestModal(true)}
            style={{
              background: '#234B73',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Request Appointment
          </button>
        </div>

        {/* My Requests Section */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ color: '#234B73', fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            My Appointment Requests
          </h2>
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
              You have not requested any appointments yet.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {appointments.map(appointment => (
                <div
                  key={appointment.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#234B73', fontWeight: 600, fontSize: 17 }}>{appointment.type}</div>
                      <div style={{ color: '#666', fontSize: 15 }}>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '14px',
                      fontWeight: '500',
                      background: appointment.status === 'pending' ? '#FEF3C7' : 
                                appointment.status === 'accepted' ? '#D1FAE5' : '#FEE2E2',
                      color: appointment.status === 'pending' ? '#92400E' : 
                            appointment.status === 'accepted' ? '#065F46' : '#991B1B'
                    }}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: 15 }}>{appointment.notes}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments List */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '24px' }}>
          <h2 style={{ color: '#234B73', fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
            My Appointments
          </h2>
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
              No appointments found. Request a new appointment to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {appointments.map(appointment => (
                <div
                  key={appointment.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ color: '#234B73', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        {appointment.type}
                      </h3>
                      <div style={{ color: '#666', fontSize: '15px' }}>
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {appointment.isOnline && (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: '#D1FAE5',
                          color: '#065F46'
                        }}>
                          Online
                        </span>
                      )}
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: appointment.status === 'pending' ? '#FEF3C7' : 
                                  appointment.status === 'accepted' ? '#D1FAE5' : '#FEE2E2',
                        color: appointment.status === 'pending' ? '#92400E' : 
                              appointment.status === 'accepted' ? '#065F46' : '#991B1B'
                      }}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#666', fontSize: '15px', marginBottom: '16px' }}>
                    {appointment.notes}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'accepted')}
                          style={{
                            background: '#234B73',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                          style={{
                            background: '#FEE2E2',
                            color: '#991B1B',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {appointment.status === 'accepted' && (
                      <button
                        onClick={() => handleStartCall(appointment)}
                        style={{
                          background: '#234B73',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>📞</span> Start Call
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Appointment Modal */}
        {showRequestModal && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.18)',
                zIndex: 1000
              }}
              onClick={() => setShowRequestModal(false)}
            />
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                zIndex: 1001,
                width: '90%',
                maxWidth: '500px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: '#234B73', fontSize: '24px', fontWeight: '600' }}>
                  Request Appointment
                </h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: '#666',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleRequestSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: '500', marginBottom: '8px' }}>
                    Appointment Type
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#234B73'
                    }}
                  >
                    <option value="career">Career Guidance</option>
                    <option value="report">Report Clarification</option>
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: '500', marginBottom: '8px' }}>
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#234B73'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: '500', marginBottom: '8px' }}>
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={requestTime}
                    onChange={(e) => setRequestTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#234B73'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: '#234B73', fontWeight: '500', marginBottom: '8px' }}>
                    Additional Notes
                  </label>
                  <textarea
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '15px',
                      color: '#234B73',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                    placeholder="Please provide any additional details about your appointment request..."
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      color: '#666',
                      fontSize: '15px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#234B73',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SCADAppointment; 