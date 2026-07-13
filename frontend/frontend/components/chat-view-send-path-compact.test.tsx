import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ChatViewSendPathCompact } from './chat-view-send-path-compact'
import { TEST_API_STATUS_SEND_READY } from '@/frontend/lib/test-fixtures/messenger-capabilities'

const noop = () => {}

describe('ChatViewSendPathCompact (IOTA Messenger)', () => {
  it('zeigt nur Online — kein Funk/Telegram/Ad-hoc', () => {
    render(
      <ChatViewSendPathCompact
        channelMode="private"
        visible
        encrypted={false}
        forcedTransport="internet"
        onForcedTransportChange={noop}
        onComposerDeliveryChange={noop}
      />
    )
    expect(screen.getByRole('button', { name: /Online/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Funk/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Telegram/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Ad-hoc/i })).not.toBeInTheDocument()
  })

  it('Online bleibt aktiv und klickbar', () => {
    const onTransport = vi.fn()
    render(
      <ChatViewSendPathCompact
        channelMode="private"
        visible
        encrypted
        forcedTransport="internet"
        onForcedTransportChange={onTransport}
        onComposerDeliveryChange={noop}
        apiStatus={TEST_API_STATUS_SEND_READY}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /online/i }))
    expect(onTransport).toHaveBeenCalledWith('internet')
    expect(screen.getByRole('button', { name: /online/i })).toHaveClass('send-path-active--online')
  })

  it('rendert nichts wenn visible=false', () => {
    const { container } = render(
      <ChatViewSendPathCompact
        channelMode="private"
        visible={false}
        encrypted={false}
        forcedTransport="internet"
        onForcedTransportChange={noop}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('Gruppe: nur Online', () => {
    render(
      <ChatViewSendPathCompact
        channelMode="group"
        visible
        encrypted={false}
        forcedTransport="internet"
        onForcedTransportChange={noop}
        onComposerDeliveryChange={noop}
      />
    )
    expect(screen.getByRole('button', { name: /online/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /funk/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /telegram/i })).not.toBeInTheDocument()
  })
})
