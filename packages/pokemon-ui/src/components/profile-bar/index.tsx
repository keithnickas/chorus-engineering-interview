import { useEffect, useRef, useState } from 'react';
import { ProfileBarPropTypes } from './types/profile-bar';
import { UUID } from 'node:crypto';
import {
  AddButton,
  AddProfileArea,
  Bar,
  ConfirmButton,
  DeleteTabBtn,
  Divider,
  Dropdown,
  Logo,
  LogoBall,
  LogoText,
  NameInput,
  ProfileLabel,
  ProfileTab,
  ProfileTabs,
  TabTeamSize,
} from './components';

export function ProfileBar({
  profiles,
  activeProfile,
  onSelect,
  onAdd,
  onDelete,
}: ProfileBarPropTypes) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Focus input when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setNewName('');
    }
  }, [dropdownOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    await onAdd(name);
    setCreating(false);
    setDropdownOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') setDropdownOpen(false);
  }

  function handleTabNavigation(keyboardEvent: React.KeyboardEvent<HTMLDivElement>) {
    if (profiles.length === 0) return;
    const currentIndex = profiles.findIndex((p) => p.uid === activeProfile?.uid);
    let nextIndex = currentIndex;

    if (keyboardEvent.key === 'ArrowRight') nextIndex = (currentIndex + 1) % profiles.length;
    else if (keyboardEvent.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + profiles.length) % profiles.length;
    else if (keyboardEvent.key === 'Home') nextIndex = 0;
    else if (keyboardEvent.key === 'End') nextIndex = profiles.length - 1;
    else return;

    keyboardEvent.preventDefault();
    onSelect(profiles[nextIndex].uid);
    setTimeout(() => {
      const tabs = tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs?.[nextIndex]?.focus();
    }, 0);
  }

  function handleDeleteTab(e: React.MouseEvent, profileId: UUID) {
    e.stopPropagation();
    onDelete(profileId);
  }

  const profileTabs = profiles.map((p) => {
    const isActive = p.uid === activeProfile?.uid;
    return (
      <ProfileTab role="tab" aria-selected={isActive} tabIndex={isActive ? 0 : -1} key={p.uid} $active={isActive} onClick={() => onSelect(p.uid)}>
        {p.name}
        <TabTeamSize $active={isActive}>{p?.pokemons?.length ?? 0}/6</TabTeamSize>
        <DeleteTabBtn
          $active={isActive}
          aria-label={`Delete profile ${p.name}`}
          onClick={(e) => handleDeleteTab(e, p.uid)}
        >
          ✕
        </DeleteTabBtn>
      </ProfileTab>
    );
  });

  return (
    <Bar>
      <Logo>
        <LogoBall />
        <LogoText>Pokédex</LogoText>
      </Logo>

      <Divider />
      <ProfileLabel>Trainer</ProfileLabel>

      <ProfileTabs role="tablist" ref={tabsRef} onKeyDown={handleTabNavigation}>{profileTabs}</ProfileTabs>

      <AddProfileArea ref={dropdownRef}>
        <AddButton
          $open={dropdownOpen}
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="Create new profile"
        >
          + New Trainer
        </AddButton>

        {dropdownOpen && (
          <Dropdown>
            <span className="hidden" id="profile-max-length">Max Length 32 characters</span>
            <NameInput
              ref={inputRef}
              aria-label="New profile name"
              aria-describedby="profile-max-length"
              type="text"
              placeholder="Trainer name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={32}
            />
            <ConfirmButton
              onClick={handleCreate}
              disabled={!newName.trim() || creating}
            >
              {creating ? '...' : 'Create'}
            </ConfirmButton>
          </Dropdown>
        )}
      </AddProfileArea>
    </Bar>
  );
}
